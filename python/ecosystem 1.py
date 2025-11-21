import random
from dataclasses import dataclass
from typing import Dict, List, Tuple
import numpy as np

class EcosystemException(Exception):
    """Custom exception for ecosystem simulation errors"""

class Creature:
    def __init__(self, species: str, 
               creature_type: str,
               vitality: float = 0.8,
               energy: float = 500.0,
               adaptability: float = 0.5):
        self.species = species
        self.creature_type = creature_type  # producer | consumer | decomposer
        self.vitality = np.clip(vitality, 0, 1)
        self.energy = max(energy, 0)
        self.adaptability = np.clip(adaptability, 0, 1)
        self.preferences = {
            'temperature': (15, 25),
            'humidity': (0.4, 0.7),
            'nutrients': ['silica', 'nitrogen']
        }

    def metabolic_cost(self, params: Dict) -> float:
        """Calculate energy consumption based on environmental conditions"""
        temp = params['climate']['temperature']
        base_cost = 1.0
        
        if self.creature_type == 'producer':
            temp_diff = abs(temp - self.preferences['temperature'][0])
            return base_cost * (1 + temp_diff/20)
        
        return base_cost * (0.5 + abs(temp - 25)/30)

@dataclass
class EcosystemParameters:
    climate: Dict[str, float]  # temperature, precipitation, humidity
    terrain: Dict[str, str]    # type, elevation, rock_type
    soil: Dict[str, float]     # nutrients, pH, organic_matter

class EcosystemSimulator:
    def __init__(self, parameters: EcosystemParameters):
        self.params = parameters
        self.creatures: List[Creature] = []
        self.history = []
        
        # Energy transfer matrices
        self.producer_energy = 1000
        self._build_consumer_matrix()
        self._build_decomposer_matrix()

    def _build_consumer_matrix(self):
        """Define probabilities of consumers eating other creatures"""
        self.consumer_prey = {
            'herbivore': ['producer'],
            'carnivore': ['secondary_consumer'],
            'omnivore': ['producer', 'primary_consumer']
        }

    def _build_decomposer_matrix(self):
        """Define decomposition efficiency rates"""
        self.decomposer_rates = {
            'fungi': 0.7,
            'bacteria': 0.9,
            'detritivore': 0.5
        }

    def add_creature(self, creature: Creature):
        """Add organism to the ecosystem"""
        if creature.creature_type not in ['producer', 'consumer', 'decomposer']:
            raise EcosystemException(f"Invalid creature type {creature.creature_type}")
        self.creatures.append(creature)

    def calculate_system_health(self) -> Dict:
        """Compute overall ecosystem health metrics"""
        vitality_scores = [c.vitality for c in self.creatures]
        diversity = len(set(c.species for c in self.creatures))
        
        return {
            'vitality_index': np.mean(vitality_scores),
            'diversity_index': diversity,
            'energy_flow': sum(c.energy for c in self.creatures if c.creature_type != 'decomposer'),
            'decomposition_rate': sum(c.energy for c in self.creatures if c.creature_type == 'decomposer')
        }

    def environmental_effects(self):
        """Apply abiotic factors to all creatures"""
        temp = self.params.climate['temperature']
        humidity = self.params.climate['humidity']
        
        for creature in self.creatures:
            # Temperature stress
            temp_opt = creature.preferences['temperature'][0]
            temp_range = creature.preferences['temperature'][1] - temp_opt
            temp_stress = max(0, abs(temp - temp_opt) - temp_range)
            
            # Humidity stress
            if not (creature.preferences['humidity'][0] <= humidity <= creature.preferences['humidity'][1]):
                creature.vitality *= 0.95

            creature.vitality *= 1 - (temp_stress / 50)

    def simulate_step(self, steps=1):
        """Run one iteration of ecosystem simulation"""
        for _ in range(steps):
            # Energy transfer cycle
            producers = [c for c in self.creatures if c.creature_type == 'producer']
            consumers = [c for c in self.creatures if c.creature_type == 'consumer']
            decomposers = [c for c in self.creatures if c.creature_type == 'decomposer']
            
            # Producers generate energy
            for producer in producers:
                producer.energy += self.producer_energy * producer.vitality
                
            # Consumers consume energy
            for consumer in consumers:
                prey_type = np.random.choice(self.consumer_prey[consumer.species])
                possible_prey = [p for p in self.creatures 
                               if p.creature_type == prey_type and p.energy > 0]
                
                if possible_prey:
                    prey = random.choice(possible_prey)
                    energy_transfer = min(250, prey.energy * 0.3)
                    prey.energy -= energy_transfer
                    consumer.energy += energy_transfer * 0.7
                    
            # Decomposers recycle energy
            dead_matter = sum(250 - c.energy for c in self.creatures if c.energy < 0)
            for decomposer in decomposers:
                decomposer.energy += dead_matter * self.decomposer_rates.get(decomposer.species, 0.5)
            
            self.environmental_effects()
            self.history.append(self.calculate_system_health())

    def get_current_state(self) -> Dict:
        return {
            'params': self.params,
            'creatures': [
                {
                    'species': c.species,
                    'type': c.creature_type,
                    'vitality': round(c.vitality, 2),
                    'energy': round(c.energy)
                } for c in self.creatures
            ],
            'health': self.calculate_system_health()
        }

# ----- Preconfigured Ecosystem Entities -----
PRODUCERS = [
    Creature('phytoplankton', 'producer', vitality=0.9), 
    Creature('sagebrush', 'producer', adaptability=0.6),
    Creature('oak_tree', 'producer', vitality=0.8)
]

CONSUMERS = [
    Creature('deer', 'consumer', vitality=0.7),
    Creature('wolf', 'consumer', adaptability=0.9),
    Creature('eagle', 'consumer', vitality=0.75)
]

DECOMPOSERS = [
    Creature('fungi', 'decomposer', vitality=0.85),
    Creature('earthworm', 'decomposer', adaptability=0.5)
]

# Example Usage
params = EcosystemParameters(
    climate={'temperature': 18.5, 'precipitation': 0.7, 'humidity': 0.6},
    terrain={'type': 'mixed_forest', 'elevation': 450, 'rock_type': 'granite'},
    soil={'nutrients': 0.65, 'pH': 6.2, 'organic_matter': 3.8}
)

ecosystem = EcosystemSimulator(params)
for org in PRODUCERS + CONSUMERS + DECOMPOSERS:
    ecosystem.add_creature(org)

ecosystem.simulate_step(steps=50)
results = ecosystem.get_current_state()
