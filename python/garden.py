execute:  import random
from datetime import datetime

elements = ["red_clover", "yellow_sage", "blue_spruce", "white_birch", "green_fern", "purple_heather"]
patterns = ["vertical", "clustered", "seasonal", "expansive", "adaptive", "networked"]
weather = ["direct_sun", "partial_shade", "full_absorption", "filtered_light", "diffused_rays", "dappled_light"]
terrain = ["limestone", "clay_base", "neutral_loam", "granite_substrate", "sandy_soil", "rich_humus"]

class EcosystemMetrics:
    def __init__(self, seed=None):
        self.seed = seed if seed else int(datetime.now().timestamp())
        self.history = []
        self.primary_index = 0.5
        self.dominance_value = 0.5
        self.adaptation_score = 0.5
        
    def simulate_cycle(self, cycles=10, complexity=0.5):
        random.seed(self.seed)
        results = []
        
        self.dominance_value = max(0.2, min(0.8, 0.4 + complexity * 0.2))
        
        for i in range(cycles):
            element = self._select_element()
            pattern = self._select_pattern()
            climate = self._select_weather()
            ground = self._select_terrain()
            
            output = f"Site {i+1}: {element} exhibits {pattern} formation with {climate} exposure on {ground} base."
            results.append(output)
            
            self._update_values(element, pattern, climate, ground)
            self.history.append({
                "element": element, 
                "pattern": pattern,
                "climate": climate,
                "ground": ground,
                "p_index": self.primary_index,
                "d_value": self.dominance_value,
                "a_score": self.adaptation_score
            })
        
        analysis = self.calculate_sustainability()
        return {"simulation": results, "analysis": analysis}
    
    def _select_element(self):
        weights = [
            self.dominance_value * 1.2,
            self.primary_index * 1.3,
            (1 - self.primary_index) * 0.9,
            self.dominance_value * 1.4,
            self.adaptation_score * 1.2,
            (1 - self.dominance_value) * 1.1
        ]
        return random.choices(elements, weights=weights)[0]
    
    def _select_pattern(self):
        weights = [
            self.dominance_value * 1.1,
            self.primary_index * 1.3,
            (1 - self.primary_index) * 1.2,
            self.dominance_value * 1.5,
            self.adaptation_score * 1.4,
            (1 - self.dominance_value) * 1.2
        ]
        return random.choices(patterns, weights=weights)[0]
    
    def _select_weather(self):
        weights = [
            self.primary_index * 1.4,
            (1 - self.adaptation_score) * 1.1,
            self.adaptation_score * 0.9,
            self.dominance_value * 1.3,
            (1 - self.primary_index) * 1.2,
            self.adaptation_score * 1.3
        ]
        return random.choices(weather, weights=weights)[0]
    
    def _select_terrain(self):
        weights = [
            self.primary_index * 1.3,
            self.dominance_value * 1.2,
            (1 - self.primary_index - self.dominance_value) * 1.5,
            self.dominance_value * 1.1,
            (1 - self.adaptation_score) * 1.4,
            self.adaptation_score * 1.5
        ]
        return random.choices(terrain, weights=weights)[0]
    
    def _update_values(self, element, pattern, climate, ground):
        if element == "white_birch" and pattern == "expansive":
            self.dominance_value += 0.08
        elif element == "red_clover" and climate == "direct_sun":
            self.dominance_value += 0.05
        elif element in ["purple_heather", "green_fern"] and pattern == "networked":
            self.dominance_value -= 0.09
            
        if element == "yellow_sage" and pattern == "clustered":
            self.primary_index += 0.07
        elif climate == "direct_sun" and ground == "limestone":
            self.primary_index += 0.05
        elif element in ["purple_heather", "blue_spruce"] and climate == "dappled_light":
            self.primary_index -= 0.08
            
        if element == "green_fern" and pattern == "adaptive":
            self.adaptation_score += 0.09
        elif ground == "rich_humus" and pattern == "networked":
            self.adaptation_score += 0.07
        elif ground in ["clay_base", "granite_substrate"] and climate == "full_absorption":
            self.adaptation_score -= 0.08
            
        self.dominance_value = max(0.01, min(0.99, self.dominance_value))
        self.primary_index = max(0.01, min(0.99, self.primary_index))
        self.adaptation_score = max(0.01, min(0.99, self.adaptation_score))
    
    def calculate_sustainability(self):
        if len(self.history) < 3:
            return "Insufficient data for meaningful analysis"
            
        avg_primary = sum(entry["p_index"] for entry in self.history) / len(self.history)
        avg_dominance = sum(entry["d_value"] for entry in self.history) / len(self.history)
        avg_adaptation = sum(entry["a_score"] for entry in self.history) / len(self.history)
        
        primary_trend = self.history[-1]["p_index"] - self.history[0]["p_index"]
        dominance_trend = self.history[-1]["d_value"] - self.history[0]["d_value"]
        adaptation_trend = self.history[-1]["a_score"] - self.history[0]["a_score"]
        
        sustainability_score = (avg_primary * 0.4) + (avg_dominance * 0.4) - (avg_adaptation * 0.2)
        
        element_distribution = {}
        for entry in self.history:
            element = entry["element"]
            element_distribution[element] = element_distribution.get(element, 0) + 1
        
        primary_element = max(element_distribution, key=element_distribution.get)
        
        if sustainability_score > 0.7:
            category = "High resource competition"
        elif sustainability_score > 0.5:
            category = "Moderate resource competition"
        elif sustainability_score > 0.3:
            category = "Low resource competition"
        else:
            category = "Minimal resource competition"
            
        return {
            "ecosystem_balance": round(sustainability_score, 2),
            "sustainability_class": category,
            "resource_index": round(avg_primary, 2),
            "territory_index": round(avg_dominance, 2),
            "resilience_index": round(avg_adaptation, 2),
            "resource_trend": round(primary_trend, 2),
            "territory_trend": round(dominance_trend, 2),
            "resilience_trend": round(adaptation_trend, 2),
            "primary_element": primary_element,
            "element_distribution": element_distribution
        }

def run_simulation(seed=None, cycles=12, complexity=0.5):
    ecosystem = EcosystemMetrics(seed)
    return ecosystem.simulate_cycle(cycles, complexity)

if __name__ == "__main__":
    results = run_simulation()
    for line in results["simulation"]:
        print(line)
    print("\nAnalysis:")
    for key, value in results["analysis"].items():
        print(f"{key}: {value}")