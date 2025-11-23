import re
import nltk
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.corpus import stopwords
from nltk.sentiment import SentimentIntensityAnalyzer
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
import matplotlib.colors as mcolors
import random
from matplotlib.patches import Polygon
import matplotlib.cm as cm

# Download necessary NLTK resources
try:
    nltk.data.find('tokenizers/punkt')
    nltk.data.find('corpora/stopwords')
    nltk.data.find('sentiment/vader_lexicon.zip')
except LookupError:
    nltk.download('punkt')
    nltk.download('stopwords')
    nltk.download('vader_lexicon')

class EcosystemAnalyzer:
    def __init__(self):
        """Initialize the ecosystem analyzer with all necessary components."""
        self.sia = SentimentIntensityAnalyzer()
        self.stop_words = set(stopwords.words('english'))
        
        # Define biotic factors - producers to apex communicators
        self.biotic_factors = {
            'producers': ['phytoplankton', 'moss', 'lichen', 'grasses', 'algae'],
            'primary_consumers': ['grasshopper', 'rabbit', 'deer', 'butterfly', 'bee'],
            'secondary_consumers': ['fox', 'owl', 'snake', 'raccoon', 'hawk'],
            'apex_communicators': ['wolf', 'eagle', 'bear', 'mountain_lion'],
            'decomposers': ['fungi', 'bacteria', 'earthworm', 'termite']
        }
        
        # Define abiotic factors
        self.climate_factors = ['temperature', 'precipitation', 'wind', 'humidity', 'pressure']
        self.terrain_features = ['mountains', 'valleys', 'rivers', 'lakes', 'plains', 'forests', 'deserts']
        self.soil_properties = ['clay', 'sand', 'loam', 'rocky', 'acidic', 'alkaline']
        
        # Interaction patterns
        self.symbiotic_relationships = ['mutualism', 'commensalism', 'parasitism', 'competition']
        self.succession_patterns = ['pioneer', 'early', 'mid', 'climax', 'disturbance']
        
        # Define color palette for visualization
        self.palette = sns.color_palette("viridis", 30)
        self.terrain_colors = {
            'mountains': '#8c510a',
            'valleys': '#01665e',
            'rivers': '#4575b4',
            'lakes': '#74add1',
            'plains': '#f46d43',
            'forests': '#1a9850',
            'deserts': '#fdae61'
        }
        
        # Keywords for each ecological element
        self.keywords = self._initialize_keywords()

    def _initialize_keywords(self):
        """Initialize keyword associations for ecological elements."""
        keywords = {
            # Producers (information foundation)
            'phytoplankton': ['data', 'fact', 'figure', 'statistic', 'number', 'metric'],
            'moss': ['background', 'context', 'history', 'setting', 'foundation'],
            'lichen': ['new', 'innovative', 'novel', 'groundbreaking', 'original'],
            'grasses': ['common', 'known', 'established', 'familiar', 'standard'],
            'algae': ['quick', 'reactive', 'immediate', 'rapid', 'prompt'],
            
            # Primary consumers (information processors)
            'grasshopper': ['specific', 'particular', 'detail', 'precise', 'exact'],
            'rabbit': ['brief', 'summary', 'overview', 'snapshot', 'glimpse'],
            'deer': ['careful', 'cautious', 'considered', 'deliberate', 'measured'],
            'butterfly': ['pattern', 'connection', 'correlation', 'association', 'link'],
            'bee': ['cross', 'connect', 'bridge', 'relate', 'unify'],
            
            # Secondary consumers (analytical patterns)
            'fox': ['strategy', 'plan', 'approach', 'method', 'tactic'],
            'owl': ['analyze', 'examine', 'investigate', 'assess', 'evaluate'],
            'snake': ['sequential', 'step', 'logical', 'linear', 'progressive'],
            'raccoon': ['solve', 'solution', 'resolve', 'address', 'fix'],
            'hawk': ['overview', 'big picture', 'broad', 'comprehensive', 'whole'],
            
            # Apex communicators (authoritative patterns)
            'wolf': ['team', 'group', 'collective', 'together', 'collaborative'],
            'eagle': ['vision', 'goal', 'mission', 'future', 'direction'],
            'bear': ['control', 'manage', 'direct', 'oversee', 'supervise'],
            'mountain_lion': ['expert', 'specialist', 'authority', 'master', 'professional'],
            
            # Decomposers (reflective communication)
            'fungi': ['simplify', 'clarify', 'streamline', 'distill', 'refine'],
            'bacteria': ['detail', 'precise', 'specific', 'particular', 'exact'],
            'earthworm': ['recycle', 'reuse', 'repurpose', 'reference', 'cite'],
            'termite': ['systematic', 'methodical', 'structured', 'organized', 'ordered'],
            
            # Climate factors
            'temperature': ['emotional', 'passion', 'feeling', 'sentiment', 'mood'],
            'precipitation': ['dense', 'detailed', 'thorough', 'comprehensive', 'exhaustive'],
            'wind': ['direction', 'influence', 'guidance', 'steer', 'lead'],
            'humidity': ['emotional content', 'sentiment', 'feeling', 'affect', 'mood'],
            'pressure': ['deadline', 'urgent', 'important', 'critical', 'vital'],
            
            # Terrain features
            'mountains': ['challenge', 'difficult', 'complex', 'complicated', 'intricate'],
            'valleys': ['easy', 'simple', 'straightforward', 'clear', 'obvious'],
            'rivers': ['flow', 'progression', 'sequence', 'series', 'succession'],
            'lakes': ['reflect', 'consider', 'contemplate', 'ponder', 'think'],
            'plains': ['open', 'clear', 'accessible', 'available', 'approachable'],
            'forests': ['complex', 'multilayered', 'nuanced', 'sophisticated', 'intricate'],
            'deserts': ['minimal', 'sparse', 'scarce', 'limited', 'restricted'],
            
            # Soil properties
            'clay': ['rigid', 'structured', 'formal', 'organized', 'methodical'],
            'sand': ['loose', 'flexible', 'adaptable', 'fluid', 'dynamic'],
            'loam': ['balanced', 'measured', 'proportionate', 'harmonious', 'even'],
            'rocky': ['difficult', 'challenging', 'tough', 'hard', 'demanding'],
            'acidic': ['critical', 'negative', 'harsh', 'severe', 'strict'],
            'alkaline': ['supportive', 'positive', 'encouraging', 'affirming', 'approving'],
            
            # Symbiotic relationships
            'mutualism': ['reciprocal', 'mutual', 'shared', 'collaborative', 'cooperative'],
            'commensalism': ['one-sided', 'unbalanced', 'asymmetric', 'uneven', 'lopsided'],
            'parasitism': ['extract', 'drain', 'deplete', 'exploit', 'use'],
            'competition': ['against', 'versus', 'compete', 'contest', 'rival'],
            
            # Succession patterns
            'pioneer': ['begin', 'start', 'initiate', 'introduce', 'launch'],
            'early': ['develop', 'evolve', 'grow', 'progress', 'advance'],
            'mid': ['establish', 'consolidate', 'strengthen', 'reinforce', 'solidify'],
            'climax': ['mature', 'advanced', 'sophisticated', 'complex', 'developed'],
            'disturbance': ['disrupt', 'change', 'shift', 'alter', 'transform']
        }
        
        # Add narcissism indicators (disguised as ecosystem health)
        keywords.update({
            'invasive_species': ['I', 'me', 'my', 'mine', 'myself'],
            'biodiversity_loss': ['always', 'never', 'everyone', 'nobody', 'best', 'worst'],
            'ecosystem_imbalance': ['should', 'must', 'have to', 'need to', 'supposed to'],
            'habitat_fragmentation': ['but', 'however', 'though', 'although', 'despite']
        })
        
        return keywords

    def analyze_text(self, text):
        """Analyze text and generate ecosystem metrics."""
        # Basic text processing
        tokens = word_tokenize(text.lower())
        words = [word for word in tokens if word.isalpha() and word not in self.stop_words]
        sentences = sent_tokenize(text)
        
        # Extract metrics
        results = {
            'ecosystem_balance': self._calculate_ecosystem_balance(tokens, words, sentences),
            'biotic_distribution': self._analyze_biotic_distribution(words, sentences),
            'abiotic_factors': self._analyze_abiotic_factors(words, sentences, text),
            'interactions': self._analyze_interactions(words, sentences, text),
            'ecosystem_health': self._analyze_ecosystem_health(words, sentences, text),
            'succession_stage': self._determine_succession_stage(words, sentences, text),
            'dominant_elements': self._identify_dominant_elements(words, sentences),
            'raw_metrics': {
                'word_count': len(words),
                'sentence_count': len(sentences),
                'avg_sentence_length': len(words) / max(1, len(sentences)),
                'vocabulary_diversity': len(set(words)) / max(1, len(words))
            }
        }
        
        return results

    def _calculate_ecosystem_balance(self, tokens, words, sentences):
        """Calculate the overall ecosystem balance (disguised narcissism score)."""
        # Count self-references
        self_references = sum(1 for word in tokens if word.lower() in ['i', 'me', 'my', 'mine', 'myself'])
        self_reference_ratio = self_references / max(1, len(sentences))
        
        # Analyze sentence structure for authoritative language
        authoritative_count = 0
        for sentence in sentences:
            if re.search(r'\b(always|never|everyone|nobody|best|worst)\b', sentence.lower()):
                authoritative_count += 1
            if re.search(r'\b(should|must|have to|need to)\b', sentence.lower()):
                authoritative_count += 1
        
        auth_ratio = authoritative_count / max(1, len(sentences))
        
        # Calculate sentiment intensity for emotional awareness
        sentiment_scores = [self.sia.polarity_scores(sentence)['compound'] for sentence in sentences]
        sentiment_variability = np.std(sentiment_scores) if sentiment_scores else 0
        
        # Combined score (0-1 scale)
        ecosystem_balance = (0.4 * self_reference_ratio + 0.4 * auth_ratio - 0.2 * sentiment_variability)
        ecosystem_balance = max(0, min(1, ecosystem_balance))
        
        return ecosystem_balance

    def _analyze_biotic_distribution(self, words, sentences):
        """Analyze the distribution of biotic factors."""
        result = {}
        
        # Calculate presence of each biotic factor
        for category, organisms in self.biotic_factors.items():
            category_score = {}
            for organism in organisms:
                # Check for keywords related to each organism
                keywords = self.keywords.get(organism, [])
                organism_score = 0
                for keyword in keywords:
                    organism_score += sum(1 for word in words if keyword in word)
                organism_score = organism_score / max(1, len(sentences))
                category_score[organism] = organism_score
            
            result[category] = category_score
        
        return result

    def _analyze_abiotic_factors(self, words, sentences, text):
        """Analyze abiotic factors in the communication."""
        result = {
            'climate': {},
            'terrain': {},
            'soil': {}
        }
        
        # Analyze climate factors
        for factor in self.climate_factors:
            keywords = self.keywords.get(factor, [])
            factor_score = 0
            for keyword in keywords:
                factor_score += sum(1 for word in words if keyword in word)
            result['climate'][factor] = factor_score / max(1, len(sentences))
        
        # Analyze terrain features
        for feature in self.terrain_features:
            keywords = self.keywords.get(feature, [])
            feature_score = 0
            for keyword in keywords:
                feature_score += sum(1 for word in words if keyword in word)
            result['terrain'][feature] = feature_score / max(1, len(sentences))
        
        # Analyze soil properties
        for property in self.soil_properties:
            keywords = self.keywords.get(property, [])
            property_score = 0
            for keyword in keywords:
                property_score += sum(1 for word in words if keyword in word)
            result['soil'][property] = property_score / max(1, len(sentences))
        
        # Add sentiment analysis as climate factors
        sentiment = self.sia.polarity_scores(text)
        result['climate']['temperature'] = (sentiment['compound'] + 1) / 2  # Convert to 0-1 scale
        result['climate']['humidity'] = max(sentiment['pos'], sentiment['neg'])
        
        return result

    def _analyze_interactions(self, words, sentences, text):
        """Analyze interaction patterns in the communication."""
        result = {
            'symbiotic': {},
            'energy_flow': {},
            'nutrient_cycling': {}
        }
        
        # Analyze symbiotic relationships
        for relationship in self.symbiotic_relationships:
            keywords = self.keywords.get(relationship, [])
            relationship_score = 0
            for keyword in keywords:
                relationship_score += sum(1 for word in words if keyword in word)
            result['symbiotic'][relationship] = relationship_score / max(1, len(sentences))
        
        # Calculate energy flow (information directionality)
        question_ratio = sum(1 for sentence in sentences if '?' in sentence) / max(1, len(sentences))
        imperative_ratio = sum(1 for sentence in sentences if re.match(r'^[A-Z][^.!?]*[.!]$', sentence)) / max(1, len(sentences))
        
        result['energy_flow'] = {
            'input': question_ratio,
            'output': imperative_ratio,
            'exchange': 1 - (question_ratio + imperative_ratio)
        }
        
        # Calculate nutrient cycling (referential communication)
        reference_words = ['this', 'that', 'these', 'those', 'aforementioned', 'above', 'below']
        reference_count = sum(1 for word in words if word in reference_words)
        
        result['nutrient_cycling']['reference_ratio'] = reference_count / max(1, len(words))
        
        return result

    def _analyze_ecosystem_health(self, words, sentences, text):
        """Analyze the health of the communication ecosystem."""
        # Diversity metrics
        species_richness = len(set(words)) / max(1, len(words))
        
        # Count word frequencies
        word_counts = Counter(words)
        total_count = sum(word_counts.values())
        
        # Shannon diversity index (evenness)
        shannon_index = 0
        for count in word_counts.values():
            proportion = count / total_count
            shannon_index -= proportion * np.log(proportion)
        evenness = shannon_index / np.log(max(2, len(word_counts)))
        
        # Dominance index
        dominance = max(word_counts.values()) / total_count if word_counts else 0
        
        # Calcuate toxicity metrics (disguised as invasive species)
        toxic_words = ['stupid', 'idiot', 'moron', 'dumb', 'fool', 'incompetent',
                      'pathetic', 'ridiculous', 'worthless', 'useless', 'failure']
        toxicity_score = sum(1 for word in words if word in toxic_words) / max(1, len(sentences))
        
        # Resilience factors
        redundancy = 1 - species_richness  # Higher word repetition indicates lower linguistic diversity
        
        # Memory (references to past)
        past_tense_indicators = ['was', 'were', 'had', 'did', 'said', 'went', 'came', 'took', 'made']
        memory_score = sum(1 for word in words if word in past_tense_indicators) / max(1, len(sentences))
        
        # Flexibility (conditional language)
        conditional_indicators = ['if', 'would', 'could', 'might', 'may', 'perhaps', 'possibly']
        flexibility_score = sum(1 for word in words if word in conditional_indicators) / max(1, len(sentences))
        
        return {
            'diversity': {
                'species_richness': species_richness,
                'evenness': evenness,
                'dominance_index': dominance
            },
            'resilience': {
                'redundancy': redundancy,
                'memory': memory_score,
                'flexibility': flexibility_score
            },
            'invasive_threat': toxicity_score
        }

    def _determine_succession_stage(self, words, sentences, text):
        """Determine the succession stage of the communication."""
        # Count occurrence of keywords for each stage
        stage_scores = {}
        for stage in self.succession_patterns:
            keywords = self.keywords.get(stage, [])
            stage_score = 0
            for keyword in keywords:
                stage_score += sum(1 for word in words if keyword in word)
            stage_scores[stage] = stage_score / max(1, len(sentences))
        
        # Additional factors for succession stage
        
        # Complexity indicators for succession stage
        avg_sentence_length = len(words) / max(1, len(sentences))
        vocabulary_diversity = len(set(words)) / max(1, len(words))
        
        # Adjust scores based on complexity
        complexity_factor = (avg_sentence_length / 20) * (vocabulary_diversity)
        
        stage_scores['pioneer'] += (1 - complexity_factor) * 0.5
        stage_scores['climax'] += complexity_factor * 0.5
        
        # Find dominant stage
        dominant_stage = max(stage_scores.items(), key=lambda x: x[1])[0]
        
        return {
            'scores': stage_scores,
            'dominant_stage': dominant_stage,
            'complexity_factor': complexity_factor
        }

    def _identify_dominant_elements(self, words, sentences):
        """Identify the dominant ecological elements in the communication."""
        # Flatten all categories for comparison
        all_elements = {}
        
        # Add biotic factors
        for category, organisms in self.biotic_factors.items():
            for organism in organisms:
                keywords = self.keywords.get(organism, [])
                score = 0
                for keyword in keywords:
                    score += sum(1 for word in words if keyword in word)
                all_elements[organism] = score / max(1, len(sentences))
        
        # Add abiotic factors
        for factor in self.climate_factors + self.terrain_features + self.soil_properties:
            keywords = self.keywords.get(factor, [])
            score = 0
            for keyword in keywords:
                score += sum(1 for word in words if keyword in word)
            all_elements[factor] = score / max(1, len(sentences))
        
        # Sort by score
        sorted_elements = sorted(all_elements.items(), key=lambda x: x[1], reverse=True)
        
        # Return top 5 elements
        return {
            'top_elements': sorted_elements[:5],
            'all_elements': all_elements
        }

    def visualize_results(self, results, title="Communication Ecosystem Analysis"):
        """Create a visually appealing ecosystem report based on analysis results."""
        # Create figure with multiple subplots
        fig = plt.figure(figsize=(20, 16))
        fig.suptitle(title, fontsize=24, y=0.98)
        
        # Set overall style
        plt.style.use('seaborn-v0_8-whitegrid')
        
        # 1. Ecosystem Balance Gauge - Top left
        ax1 = fig.add_subplot(3, 3, 1)
        self._plot_ecosystem_gauge(ax1, results['ecosystem_balance'])
        
        # 2. Biotic Distribution - Top center
        ax2 = fig.add_subplot(3, 3, 2)
        self._plot_biotic_distribution(ax2, results['biotic_distribution'])
        
        # 3. Terrain Map - Top right
        ax3 = fig.add_subplot(3, 3, 3)
        self._plot_terrain_map(ax3, results['abiotic_factors']['terrain'])
        
        # 4. Climate Factors - Middle left
        ax4 = fig.add_subplot(3, 3, 4)
        self._plot_climate_factors(ax4, results['abiotic_factors']['climate'])
        
        # 5. Succession Stage - Middle center
        ax5 = fig.add_subplot(3, 3, 5)
        self._plot_succession_stage(ax5, results['succession_stage'])
        
        # 6. Ecosystem Health - Middle right
        ax6 = fig.add_subplot(3, 3, 6)
        self._plot_ecosystem_health(ax6, results['ecosystem_health'])
        
        # 7. Energy Flow - Bottom left
        ax7 = fig.add_subplot(3, 3, 7)
        self._plot_energy_flow(ax7, results['interactions']['energy_flow'])
        
        # 8. Symbiotic Relationships - Bottom center
        ax8 = fig.add_subplot(3, 3, 8)
        self._plot_symbiotic_relationships(ax8, results['interactions']['symbiotic'])
        
        # 9. Dominant Elements - Bottom right
        ax9 = fig.add_subplot(3, 3, 9)
        self._plot_dominant_elements(ax9, results['dominant_elements']['top_elements'])
        
        plt.tight_layout(rect=[0, 0.03, 1, 0.95])
        
        return fig

    def _plot_ecosystem_gauge(self, ax, balance_score):
        """Plot the ecosystem balance gauge."""
        ax.set_aspect('equal')
        ax.set_title('Ecosystem Balance', fontsize=14)
        
        # Create gauge
        theta = np.linspace(0, 180, 100)
        r = 1.0
        
        # Convert to cartesian
        x = r * np.cos(np.radians(theta))
        y = r * np.sin(np.radians(theta))
        
        # Plot gauge background
        cmap = cm.get_cmap('RdYlGn_r')
        norm = mcolors.Normalize(0, 1)
        
        for i in range(len(theta)-1):
            color = cmap(norm(i/len(theta)))
            ax.fill_between([x[i], x[i+1]], [y[i], y[i+1]], color=color, alpha=0.7)
        
        # Add needle
        angle = 180 * balance_score
        needle_x = r * np.cos(np.radians(angle))
        needle_y = r * np.sin(np.radians(angle))
        ax.plot([0, needle_x], [0, needle_y], 'k-', lw=3)
        ax.add_patch(plt.Circle((0, 0), 0.05, color='black'))
        
        # Add labels
        ax.text(-0.9, 0.2, 'Stable', fontsize=12)
        ax.text(0.7, 0.2, 'Unstable', fontsize=12)
        
        # Add value
        category = "Minimal" if balance_score <= 0.3 else "Low" if balance_score <= 0.5 else "Moderate" if balance_score <= 0.7 else "High"
        ax.text(0, -0.3, f"{balance_score:.2f} - {category}", ha='center', fontsize=14)
        
        ax.set_xlim(-1.2, 1.2)
        ax.set_ylim(-0.5, 1.2)
        ax.axis('off')

    def _plot_biotic_distribution(self, ax, biotic_data):
        """Plot the distribution of biotic factors."""
        ax.set_title('Biotic Distribution', fontsize=14)
        
        # Prepare data for heatmap
        categories = list(biotic_data.keys())
        
        # Create a list of all organisms
        all_organisms = []
        for category in categories:
            all_organisms.extend(list(biotic_data[category].keys()))
        
        # Create data matrix
        data_matrix = np.zeros((len(categories), len(all_organisms)))
        organism_labels = []
        
        col_index = 0
        for i, category in enumerate(categories):
            for organism in biotic_data[category]:
                data_matrix[i, col_index] = biotic_data[category][organism]
                if i == 0:  # Only add labels once
                    organism_labels.append(organism)
                col_index += 1
                if col_index >= len(all_organisms):
                    break
        
        # Plot heatmap
        im = ax.imshow(data_matrix, cmap='viridis')
        
        # Add colorbar
        cbar = ax.figure.colorbar(im, ax=ax)
        cbar.set_label('Presence Score')
        
        # Set ticks and labels
        ax.set_yticks(np.arange(len(categories)))
        ax.set_yticklabels([c.replace('_', ' ').title() for c in categories])
        
        # Rotate x-axis labels and set them
        plt.setp(ax.get_xticklabels(), rotation=45, ha="right", rotation_mode="anchor")
        ax.set_xticks(np.arange(len(organism_labels)))
        ax.set_xticklabels([o.replace('_', ' ').title() for o in organism_labels])
        
        ax.set_xlabel('Organisms')
        ax.set_ylabel('Trophic Levels')

    def _plot_terrain_map(self, ax, terrain_data):
        """Plot a terrain map based on terrain features."""
        ax.set_title('Communication Terrain', fontsize=14)
        
        # Create a custom terrain visualization
        # Use Voronoi tessellation to create irregular terrain regions
        num_points = 50
        points = np.random.rand(num_points, 2)
        
        # Assign terrain types to Voronoi regions
        from scipy.spatial import Voronoi
        vor = Voronoi(points)
        
        # Normalize terrain data
        total = sum(terrain_data.values())
        norm_terrain = {k: v/max(0.001, total) for k, v in terrain_data.items()}
        
        # Sort by value for the distribution
        sorted_terrain = sorted(norm_terrain.items(), key=lambda x: x[1], reverse=True)
        terrain_assignment = []
        
        # Assign terrain types to regions based on their proportion
        remaining = 1.0
        for terrain, value in sorted_terrain:
            # Calculate how many regions this terrain should get
            terrain_regions = int(value * num_points)
            terrain_assignment.extend([terrain] * terrain_regions)
            remaining -= value
        
        # Fill any remaining regions with the most common terrain
        while len(terrain_assignment) < num_points:
            terrain_assignment.append(sorted_terrain[0][0])
        
        # Shuffle the assignments
        random.shuffle(terrain_assignment)
        
        # Plot Voronoi regions
        for i, region_idx in enumerate(vor.point_region):
            region = vor.regions[region_idx]
            if -1 not in region and len(region) > 0:
                # Get vertices of the region
                polygon = [vor.vertices[v] for v in region]
                if len(polygon) >= 3:  # Only plot regions with at least 3 vertices
                    terrain_type = terrain_assignment[i % len(terrain_assignment)]
                    color = self.terrain_colors.get(terrain_type, '#cccccc')
                    ax.fill(*zip(*polygon), color=color, alpha=0.7)
        
        # Add terrain legend
        handles = [plt.Rectangle((0,0),1,1, color=self.terrain_colors.get(t, '#cccccc')) 
                  for t in self.terrain_colors.keys()]
        labels = [t.replace('_', ' ').title() for t in self.terrain_colors.keys()]
        ax.legend(handles, labels, loc='upper right', fontsize=8)
        
        # Add top terrain types as text
        top_terrains = sorted_terrain[:3]
        terrain_text = "\n".join([f"{t.replace('_', ' ').title()}: {v:.2f}" 
                                for t, v in top_terrains])
        ax.text(0.05, 0.05, f"Dominant Terrains:\n{terrain_text}", 
                transform=ax.transAxes, fontsize=10, 
                bbox=dict(facecolor='white', alpha=0.7))
        
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.set_aspect('equal')
        ax.axis('off')

    def _plot_climate_factors(self, ax, climate_data):
        """Plot climate factors as a radar chart."""
        ax.set_title('Climate Factors', fontsize=14)
        
        # Number of variables
        categories = list(climate_data.keys())
        N = len(categories)
        
        # What will be the angle of each axis in the plot
        angles = [n / float(N) * 2 * np.pi for n in range(N)]
        angles += angles[:1]  # Close the loop
        
        # Get data values
        values = list(climate_data.values())
        values += values[:1]  # Close the loop
        
        # Draw the plot
        ax.polar(angles, values, marker='o', linestyle='-', linewidth=2)
        
        # Fill area
        ax.fill(angles, values, alpha=0.25)
        
        # Set category labels
        plt.xticks(angles[:-1], [c.replace('_', ' ').title() for c in categories])
        
        # Add value labels
        for i in range(N):
            ax.annotate(f"{values[i]:.2f}", 
                       xy=(angles[i], values[i]),
                       xytext=(angles[i], values[i]+0.1),
                       ha='center')
        
        # Customize the grid
        ax.set_rlabel_position(0)
        plt.yticks([0.25, 0.5, 0.75], ["0.25", "0.50", "0.75"], color="grey", size=8)
        plt.ylim(0, 1)

    def _plot_succession_stage(self, ax, succession_data):
        """Plot succession stage as a horizontal progress bar."""
        ax.set_title('Ecosystem Succession Stage', fontsize=14)
        
        stages = ['pioneer', 'early', 'mid', 'climax', 'disturbance']
        scores = [succession_data['scores'].get(stage, 0) for stage in stages]
        
        # Normalize scores for percentage
        total = sum(scores)
        if total > 0:
            norm_scores = [score/total for score in scores]
        else:
            norm_scores = [0.2] * 5
        
        # Create horizontal stacked bar
        colors = ['#AED581', '#7CB342', '#558B2F', '#33691E', '#FF8F00']
        cum_score = 0
        
        # Create the stacked bar
        for i, (stage, score, color) in enumerate(zip(stages, norm_scores, colors)):
            ax.barh(0, score, left=cum_score, height=0.5, color=color, alpha=0.7)
            
            # Add label if segment is wide enough
            if score > 0.05:
                ax.text(cum_score + score/2, 0, 
                       stage.title(), 
                       ha='center', va='center', 
                       color='black', fontsize=10)
            
            cum_score += score
        
        # Mark dominant stage with arrow
        dominant_idx = stages.index(succession_data['dominant_stage'])
        dominant_pos = sum(norm_scores[:dominant_idx]) + norm_scores[dominant_idx]/2
        ax.annotate('', xy=(dominant_pos, -0.1), xytext=(dominant_pos, -0.3),
                   arrowprops=dict(facecolor='black', shrink=0.05, width=2, headwidth=8))
        ax.text(dominant_pos, -0.4, "Current Stage", ha='center', va='center', fontsize=12)
        
        # Customize the chart
        ax.set_yticks([])
        ax.set_xlim(0, 1)
        ax.set_ylim(-0.5, 0.5)
        ax.set_xlabel('Progression')
        
        # Add a legend
        handles = [plt.Rectangle((0,0),1,1, color=color, alpha=0.7) for color in colors]
        ax.legend(handles, [s.title() for s in stages], loc='upper center', 
                 bbox_to_anchor=(0.5, -0.15), ncol=5, fontsize=9)

    def _plot_ecosystem_health(self, ax, health_data):
        """Plot ecosystem health metrics."""
        ax.set_title('Ecosystem Health Indicators', fontsize=14)
        
        # Prepare data
        diversity = health_data['diversity']
        resilience = health_data['resilience']
        
        # Combine into one dataset for grouped bar chart
        labels = ['Species\nRichness', 'Evenness', 'Redundancy', 'Memory', 'Flexibility']
        values = [
            diversity['species_richness'],
            diversity['evenness'],
            resilience['redundancy'],
            resilience['memory'],
            resilience['flexibility']
        ]
        
        # Create bar chart
        bars = ax.bar(labels, values, color=sns.color_palette('viridis', len(labels)))
        
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.02,
                   f'{height:.2f}', ha='center', va='bottom', fontsize=9)
        
        # Add invasive threat indicator
        invasive_threat = health_data['invasive_threat']
        ax.text(0.95, 0.95, f"Invasive Threat: {invasive_threat:.2f}",
               transform=ax.transAxes, fontsize=10,
               bbox=dict(facecolor='red' if invasive_threat > 0.2 else 'green', alpha=0.2))
        
        # Customize the chart
        ax.set_ylim(0, 1.1)
        ax.set_ylabel('Score')
        plt.setp(ax.get_xticklabels(), rotation=0)

    def _plot_energy_flow(self, ax, energy_data):
        """Plot energy flow in the ecosystem."""
        ax.set_title('Energy Flow Dynamics', fontsize=14)
        
        # Create a sankey-style diagram
        left_labels = ['Input', 'Exchange', 'Output']
        left_values = [energy_data['input'], energy_data['exchange'], energy_data['output']]
        
        # Define right categories
        right_labels = ['Information\nGathering', 'Knowledge\nSharing', 'Direction\nSetting']
        
        # Define how left categories flow to right categories (connection widths)
        connections = [
            [0.7, 0.2, 0.1],  # Input flows primarily to Information Gathering
            [0.2, 0.7, 0.1],  # Exchange flows primarily to Knowledge Sharing
            [0.1, 0.2, 0.7]   # Output flows primarily to Direction Setting
        ]
        
        # Calculate positions
        left_y = np.cumsum([0] + left_values) - np.array(left_values) / 2
        
        # Define right values based on connections
        right_values = [0, 0, 0]
        for i in range(3):
            for j in range(3):
                right_values[j] += left_values[i] * connections[i][j]
                
        right_y = np.cumsum([0] + right_values) - np.array(right_values) / 2
        
        # Plot the connections
        for i, (left_val, left_pos) in enumerate(zip(left_values, left_y)):
            for j, (right_val, right_pos) in enumerate(zip(right_values, right_y)):
                connection_width = left_val * connections[i][j]
                if connection_width > 0.01:  # Only draw significant connections
                    # Create bezier curve
                    verts = [
                        (0.1, left_pos - left_val/2 + sum(left_values[:i] * [c[j] for c in connections[:i]])),
                        (0.4, left_pos),
                        (0.6, right_pos),
                        (0.9, right_pos - right_val/2 + sum(left_values * [c[j] for c in connections])[:i+1])
                    ]
                    codes = [1, 2, 2, 2]  # MOVETO, CURVE4, CURVE4, CURVE4
                    
                    # Actually, let's simplify and use a polygon
                    # Top and bottom y-coordinates for left side
                    left_top = left_pos - left_val/2 + sum([left_values[k] * connections[k][j] for k in range(i)])
                    left_bottom = left_top + left_val * connections[i][j]
                    
                    # Top and bottom y-coordinates for right side
                    flow_to_this_right = sum([left_values[k] * connections[k][j] for k in range(i+1)])
                    right_top = right_pos - right_val/2 + flow_to_this_right - left_val * connections[i][j]
                    right_bottom = right_top + left_val * connections[i][j]
                    
                    polygon = [(0.2, left_top), (0.8, right_top), (0.8, right_bottom), (0.2, left_bottom)]
                    color = plt.cm.viridis(i/3)
                    ax.add_patch(Polygon(polygon, closed=True, color=color, alpha=0.5))
        
        # Plot the left and right bars
        for i, (val, pos, label) in enumerate(zip(left_values, left_y, left_labels)):
            ax.barh(pos, 0.15, height=val, left=0.05, color=plt.cm.viridis(i/3))
            ax.text(0.03, pos, f"{label}\n{val:.2f}", va='center', ha='right', fontsize=9)
            
        for i, (val, pos, label) in enumerate(zip(right_values, right_y, right_labels)):
            ax.barh(pos, 0.15, height=val, left=0.8, color=plt.cm.viridis((i+3)/6))
            ax.text(0.97, pos, f"{label}\n{val:.2f}", va='center', ha='left', fontsize=9)
        
        # Customize the chart
        ax.set_xlim(0, 1)
        ax.set_ylim(-0.1, 1.1)
        ax.axis('off')

    def _plot_symbiotic_relationships(self, ax, symbiotic_data):
        """Plot symbiotic relationships."""
        ax.set_title('Symbiotic Relationships', fontsize=14)
        
        # Prepare data
        relationships = list(symbiotic_data.keys())
        values = list(symbiotic_data.values())
        
        # Define colors
        colors = ['#4CAF50', '#2196F3', '#F44336', '#FFC107']
        
        # Create donut chart
        wedges, texts, autotexts = ax.pie(
            values, 
            labels=None,
            autopct='%1.1f%%',
            startangle=90,
            colors=colors,
            wedgeprops=dict(width=0.5, edgecolor='w')
        )
        
        # Add relationship labels with lines
        for i, p in enumerate(wedges):
            ang = (p.theta2 - p.theta1)/2. + p.theta1
            y = np.sin(np.deg2rad(ang))
            x = np.cos(np.deg2rad(ang))
            
            # Determine text alignment based on position
            horizontalalignment = {-1: "right", 1: "left"}[int(np.sign(x))]
            connectionstyle = f"angle,angleA=0,angleB={ang}"
            
            # Add the line and label
            ax.annotate(
                relationships[i].replace('_', ' ').title(), 
                xy=(x*0.75, y*0.75),
                xytext=(1.35*np.sign(x), 1.4*y),
                horizontalalignment=horizontalalignment,
                connectionstyle=connectionstyle,
                arrowprops=dict(arrowstyle="-", color="black", lw=1)
            )
        
        # Add circle in the middle
        circle = plt.Circle((0,0), 0.25, fc='white')
        ax.add_patch(circle)
        
        # Add text in the middle
        dominant = max(zip(values, relationships), key=lambda x: x[0])[1]
        ax.text(0, 0, f"Dominant:\n{dominant.title()}", ha='center', va='center', fontsize=10)
        
        ax.set_aspect('equal')

    def _plot_dominant_elements(self, ax, top_elements):
        """Plot the dominant ecological elements."""
        ax.set_title('Dominant Ecological Elements', fontsize=14)
        
        # Prepare data
        elements = [e[0].replace('_', ' ').title() for e in top_elements]
        values = [e[1] for e in top_elements]
        
        # Create horizontal bar chart with custom colors
        colors = sns.color_palette('viridis', len(elements))
        bars = ax.barh(elements, values, color=colors)
        
        # Add value labels
        for bar in bars:
            width = bar.get_width()
            ax.text(width + 0.01, bar.get_y() + bar.get_height()/2,
                   f'{width:.2f}', va='center', fontsize=9)
        
        # Customize the chart
        ax.set_xlim(0, max(values) * 1.2)
        ax.set_xlabel('Presence Score')
        plt.setp(ax.get_yticklabels(), rotation=0)
        
        # Add interpretation guide
        interpretation = ""
        if len(elements) > 0:
            interpretation += f"• {elements[0]} is the most prominent element\n"
        if len(elements) > 1:
            interpretation += f"• {elements[1]} provides supporting influence\n"
        if any('Mountains' in e for e in elements):
            interpretation += "• Communication contains challenging elements\n"
        elif any('Plains' in e or 'Valleys' in e for e in elements):
            interpretation += "• Communication style is accessible and clear\n"
            
        ax.text(0.5, -0.2, interpretation, transform=ax.transAxes, 
               fontsize=9, va='top', bbox=dict(facecolor='white', alpha=0.7))

    def generate_report(self, text, title="Communication Ecosystem Analysis"):
        """Analyze text and generate a full report with visualizations."""
        # Analyze the text
        results = self.analyze_text(text)
        
        # Create visualization
        fig = self.visualize_results(results, title)
        
        # Generate text summary
        summary = self._generate_text_summary(results)
        
        return {
            'results': results,
            'figure': fig,
            'summary': summary
        }
        
    def _generate_text_summary(self, results):
        """Generate a text summary of the ecosystem analysis."""
        ecosystem_balance = results['ecosystem_balance']
        balance_category = "Minimal" if ecosystem_balance <= 0.3 else "Low" if ecosystem_balance <= 0.5 else "Moderate" if ecosystem_balance <= 0.7 else "High"
        
        dominant_elements = [e[0].replace('_', ' ').title() for e in results['dominant_elements']['top_elements'][:3]]
        dominant_stage = results['succession_stage']['dominant_stage'].title()
        
        # Get top biotic elements
        top_biotic = {}
        for category, organisms in results['biotic_distribution'].items():
            top_organism = max(organisms.items(), key=lambda x: x[1])
            top_biotic[category] = (top_organism[0].replace('_', ' ').title(), top_organism[1])
        
        # Get dominant symbiotic relationship
        symbiotic = results['interactions']['symbiotic']
        dominant_symbiotic = max(symbiotic.items(), key=lambda x: x[1])[0].replace('_', ' ').title()
        
        # Generate the summary
        summary = f"""
# Ecosystem Analysis Summary

## Overall Health: {balance_category} Balance ({ecosystem_balance:.2f})

The communication ecosystem shows a **{balance_category.lower()} balance** level, indicating {'a healthy, sustainable pattern' if ecosystem_balance <= 0.5 else 'some concerning patterns that may need attention'}.

## Dominant Elements
The ecosystem is primarily characterized by:
- {dominant_elements[0]}
- {dominant_elements[1] if len(dominant_elements) > 1 else 'No secondary element'}
- {dominant_elements[2] if len(dominant_elements) > 2 else 'No tertiary element'}

## Ecological Distribution
- **Producers:** {top_biotic['producers'][0]} ({top_biotic['producers'][1]:.2f})
- **Primary Consumers:** {top_biotic['primary_consumers'][0]} ({top_biotic['primary_consumers'][1]:.2f})
- **Secondary
