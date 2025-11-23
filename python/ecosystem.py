import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime
import random
from collections import Counter, defaultdict
import json

class CommunicationEcosystem:
    def __init__(self, config=None):
        """Initialize the ecosystem simulation with optional configuration"""
        # Load default configuration if none provided
        self.config = config if config else self._default_config()
        
        # Initialize state variables
        self.history = []
        self.current_state = {}
        self.metrics = {}
        
        # Set random seed for reproducibility
        random.seed(datetime.now().timestamp())
    
    def _default_config(self):
        """Generate default configuration for the ecosystem"""
        return {
            "biotic_weights": {
                "producers": 0.25,
                "primary_consumers": 0.3,
                "secondary_consumers": 0.25,
                "apex_communicators": 0.1,
                "decomposers": 0.1
            },
            "abiotic_weights": {
                "climate": 0.4,
                "terrain": 0.3,
                "soil": 0.3
            },
            "interaction_sensitivity": 0.5,
            "resilience_threshold": 0.4,
            "diversity_importance": 0.6
        }
    
    def analyze_text(self, text, context=None):
        """Analyze a text input and update the ecosystem state"""
        # Process the text to extract features
        features = self._extract_features(text)
        
        # Create new state based on features and context
        new_state = self._generate_state(features, context)
        
        # Record history
        if self.current_state:
            self.history.append(self.current_state)
        
        # Update current state
        self.current_state = new_state
        
        # Calculate metrics
        self.metrics = self._calculate_metrics()
        
        return self.metrics
    
    def _extract_features(self, text):
        """Extract relevant features from the text for ecosystem analysis"""
        # Lowercase and tokenize
        words = text.lower().split()
        total_words = len(words)
        if total_words == 0:
            return {}
        
        features = {
            # Basic text features
            "word_count": total_words,
            "avg_word_length": sum(len(word) for word in words) / total_words,
            "unique_words": len(set(words)) / total_words,
            
            # Self-reference indicators
            "self_references": self._count_occurrences(words, ["i", "me", "my", "mine", "myself"]) / total_words,
            
            # Authority indicators
            "authority_terms": self._count_occurrences(words, ["must", "should", "always", "never", "certainly", "definitely"]) / total_words,
            
            # Question ratio
            "question_ratio": text.count('?') / (max(1, len(text.split('.')))),
            
            # Emotional content
            "positive_sentiment": self._sentiment_score(text, "positive"),
            "negative_sentiment": self._sentiment_score(text, "negative"),
            
            # Complexity indicators
            "complexity": self._calculate_complexity(text),
            
            # Conceptual density
            "concept_density": self._concept_density(text),
            
            # Collaborative language
            "collaborative_terms": self._count_occurrences(words, ["we", "us", "our", "together", "both", "all"]) / total_words
        }
        
        return features
    
    def _count_occurrences(self, words, target_list):
        """Count occurrences of words from a target list"""
        return sum(1 for word in words if word in target_list)
    
    def _sentiment_score(self, text, sentiment_type):
        """Simple sentiment analysis (in a full implementation, use a proper NLP library)"""
        # Simplified implementation - would use sentiment analysis library in production
        positive_words = ["good", "great", "best", "positive", "excellent", "nice", "wonderful", "happy", "beneficial"]
        negative_words = ["bad", "worst", "negative", "terrible", "awful", "disappointing", "unhappy", "harmful"]
        
        words = text.lower().split()
        total_words = max(1, len(words))
        
        if sentiment_type == "positive":
            return sum(1 for word in words if word in positive_words) / total_words
        else:
            return sum(1 for word in words if word in negative_words) / total_words
    
    def _calculate_complexity(self, text):
        """Calculate linguistic complexity"""
        sentences = text.split('.')
        if not sentences:
            return 0
            
        # Average sentence length
        avg_sentence_length = sum(len(s.split()) for s in sentences if s) / max(1, len([s for s in sentences if s]))
        
        # Normalize to 0-1 scale (assuming max reasonable sentence length is 30)
        return min(1.0, avg_sentence_length / 30)
    
    def _concept_density(self, text):
        """Estimate conceptual density based on unique meaningful words"""
        # This is a simplified implementation
        common_words = ["the", "and", "a", "to", "of", "in", "is", "it", "that", "for", "on", "with", "as", "this", "by"]
        words = [w for w in text.lower().split() if w not in common_words]
        
        if not words:
            return 0
            
        return len(set(words)) / len(words)
    
    def _generate_state(self, features, context=None):
        """Generate a new ecosystem state based on extracted features and optional context"""
        if not features:
            return {}
            
        # Default context if none provided
        context = context or {
            "topic_complexity": 0.5,
            "social_pressure": 0.3,
            "time_constraints": 0.4
        }
        
        # Generate biotic components (organisms)
        biotic = self._generate_biotic_state(features, context)
        
        # Generate abiotic components (environment)
        abiotic = self._generate_abiotic_state(features, context)
        
        # Generate interaction networks
        interactions = self._generate_interactions(biotic, abiotic)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "features": features,
            "context": context,
            "biotic": biotic,
            "abiotic": abiotic,
            "interactions": interactions
        }
    
    def _generate_biotic_state(self, features, context):
        """Generate the biotic (organism) components of the ecosystem"""
        # Producers (based on informational content)
        producers = {
            "phytoplankton": max(0, min(1, features["word_count"] / 300)),
            "moss": max(0, min(1, 1 - features["complexity"])),
            "lichen": max(0, min(1, features["concept_density"])),
            "grasses": max(0, min(1, 1 - features["unique_words"])),
            "algae": max(0, min(1, features["question_ratio"]))
        }
        
        # Primary consumers (based on basic information processing)
        primary_consumers = {
            "grasshopper": max(0, min(1, features["complexity"] * (1 - features["self_references"]))),
            "rabbit": max(0, min(1, features["avg_word_length"] / 10)),
            "deer": max(0, min(1, 1 - features["authority_terms"])),
            "butterfly": max(0, min(1, features["unique_words"])),
            "bee": max(0, min(1, features["collaborative_terms"]))
        }
        
        # Secondary consumers (analytical patterns)
        secondary_consumers = {
            "fox": max(0, min(1, features["complexity"] * (1 - context["time_constraints"]))),
            "owl": max(0, min(1, features["concept_density"] * (1 - features["self_references"]))),
            "snake": max(0, min(1, (1 - features["question_ratio"]) * features["avg_word_length"] / 10)),
            "raccoon": max(0, min(1, features["unique_words"] * context["topic_complexity"])),
            "hawk": max(0, min(1, (1 - features["concept_density"]) * context["topic_complexity"]))
        }
        
        # Apex communicators (authoritative patterns)
        apex_communicators = {
            "wolf": max(0, min(1, features["collaborative_terms"] * features["authority_terms"] * 3)),
            "eagle": max(0, min(1, features["concept_density"] * (1 - features["self_references"]) * context["topic_complexity"])),
            "bear": max(0, min(1, features["authority_terms"] * (1 - features["collaborative_terms"]) * 3)),
            "mountain_lion": max(0, min(1, features["self_references"] * features["authority_terms"] * 3))
        }
        
        # Decomposers (reflective communication)
        decomposers = {
            "fungi": max(0, min(1, (1 - features["complexity"]) * features["concept_density"])),
            "bacteria": max(0, min(1, features["word_count"] / 500 * features["unique_words"])),
            "earthworm": max(0, min(1, features["collaborative_terms"] * (1 - features["authority_terms"]))),
            "termite": max(0, min(1, features["complexity"] * (1 - features["self_references"]) * context["topic_complexity"]))
        }
        
        return {
            "producers": producers,
            "primary_consumers": primary_consumers,
            "secondary_consumers": secondary_consumers,
            "apex_communicators": apex_communicators,
            "decomposers": decomposers
        }
    
    def _generate_abiotic_state(self, features, context):
        """Generate the abiotic (environmental) components of the ecosystem"""
        # Climate factors
        climate = {
            "temperature": self._scale_to_range(features["positive_sentiment"] - features["negative_sentiment"], -1, 1, 0, 1),
            "precipitation": max(0, min(1, features["word_count"] / 500)),
            "wind": max(0, min(1, features["authority_terms"] * 3)),
            "humidity": max(0, min(1, features["positive_sentiment"] + features["negative_sentiment"])),
            "pressure": max(0, min(1, context["social_pressure"] * context["time_constraints"]))
        }
        
        # Terrain features
        terrain_base = {
            "mountains": max(0, min(1, features["complexity"] * context["topic_complexity"])),
            "valleys": max(0, min(1, (1 - features["complexity"]) * (1 - context["topic_complexity"]))),
            "rivers": max(0, min(1, features["avg_word_length"] / 10 * (1 - features["self_references"]))),
            "lakes": max(0, min(1, (1 - features["authority_terms"]) * features["question_ratio"])),
            "plains": max(0, min(1, (1 - features["complexity"]) * features["collaborative_terms"])),
            "forests": max(0, min(1, features["concept_density"] * features["unique_words"])),
            "deserts": max(0, min(1, (1 - features["word_count"] / 500) * (1 - features["collaborative_terms"])))
        }
        
        # Normalize terrain to sum to 1
        terrain_sum = sum(terrain_base.values())
        terrain = {k: v / max(terrain_sum, 0.001) for k, v in terrain_base.items()}
        
        # Soil properties
        soil = {
            "clay": max(0, min(1, features["authority_terms"] * (1 - features["question_ratio"]))),
            "sand": max(0, min(1, (1 - features["concept_density"]) * (1 - features["complexity"]))),
            "loam": max(0, min(1, features["collaborative_terms"] * (1 - features["self_references"]))),
            "rocky": max(0, min(1, context["topic_complexity"] * (1 - features["collaborative_terms"]))),
            "acidic": max(0, min(1, features["negative_sentiment"] * (1 - features["collaborative_terms"]))),
            "alkaline": max(0, min(1, features["positive_sentiment"] * (1 - features["authority_terms"])))
        }
        
        return {
            "climate": climate,
            "terrain": terrain,
            "soil": soil
        }
    
    def _generate_interactions(self, biotic, abiotic):
        """Generate the interaction networks between ecosystem components"""
        # Symbiotic relationships
        symbiotic = {
            "mutualism": max(0, min(1, self._flatten_dict(biotic["producers"]) * self._flatten_dict(biotic["primary_consumers"]))),
            "commensalism": max(0, min(1, self._flatten_dict(biotic["secondary_consumers"]) * (1 - self._flatten_dict(biotic["primary_consumers"])))),
            "parasitism": max(0, min(1, self._flatten_dict(biotic["apex_communicators"]) * (1 - self._flatten_dict(biotic["decomposers"])))),
            "competition": max(0, min(1, self._flatten_dict(biotic["apex_communicators"]) * self._flatten_dict(abiotic["climate"]))),
        }
        
        # Succession patterns
        succession = {
            "pioneer": max(0, min(1, self._flatten_dict(biotic["producers"]) * (1 - self._flatten_dict(biotic["secondary_consumers"])))),
            "early": max(0, min(1, self._flatten_dict(biotic["primary_consumers"]) * (1 - self._flatten_dict(biotic["apex_communicators"])))),
            "mid": max(0, min(1, self._flatten_dict(biotic["secondary_consumers"]) * (1 - self._flatten_dict(biotic["decomposers"])))),
            "climax": max(0, min(1, self._flatten_dict(biotic["apex_communicators"]) * self._flatten_dict(biotic["decomposers"]))),
            "disturbance": max(0, min(1, self._flatten_dict(abiotic["climate"]) * (1 - self._flatten_dict(biotic["producers"]))))
        }
        
        return {
            "symbiotic": symbiotic,
            "succession": succession
        }
    
    def _flatten_dict(self, nested_dict, weight=None):
        """Calculate a weighted average of values in a nested dictionary"""
        if not nested_dict:
            return 0
            
        if weight is None:
            # Equal weighting
            return sum(nested_dict.values()) / len(nested_dict)
        else:
            # Apply custom weighting
            weighted_sum = 0
            for k, v in nested_dict.items():
                if k in weight:
                    weighted_sum += v * weight[k]
                else:
                    weighted_sum += v * (1 / len(nested_dict))
            return weighted_sum
    
    def _scale_to_range(self, value, old_min, old_max, new_min, new_max):
        """Scale a value from one range to another"""
        # Handle division by zero
        if old_max == old_min:
            return (new_max + new_min) / 2
            
        return ((value - old_min) / (old_max - old_min)) * (new_max - new_min) + new_min
    
    def _calculate_metrics(self):
        """Calculate key ecosystem metrics from the current state"""
        if not self.current_state:
            return {}
            
        biotic = self.current_state.get("biotic", {})
        abiotic = self.current_state.get("abiotic", {})
        interactions = self.current_state.get("interactions", {})
        
        # Calculate diversity metrics
        all_organisms = {}
        for category, organisms in biotic.items():
            all_organisms.update(organisms)
        
        # Species richness (number of species with significant presence)
        significant_threshold = 0.2
        species_richness = len([v for v in all_organisms.values() if v > significant_threshold])
        
        # Calculate evenness (using Pielou's evenness index - simplified)
        total = sum(all_organisms.values())
        if total > 0:
            proportions = [v/total for v in all_organisms.values() if v > 0]
            shannon_index = -sum(p * np.log(p) for p in proportions)
            max_shannon = np.log(len(proportions)) if len(proportions) > 0 else 0
            evenness = shannon_index / max_shannon if max_shannon > 0 else 0
        else:
            evenness = 0
        
        # Dominant species
        dominant_species = max(all_organisms.items(), key=lambda x: x[1]) if all_organisms else ("none", 0)
        
        # Ecosystem balance (producer to consumer ratio)
        producer_total = sum(biotic.get("producers", {}).values())
        consumer_total = sum(biotic.get("primary_consumers", {}).values()) + sum(biotic.get("secondary_consumers", {}).values()) + sum(biotic.get("apex_communicators", {}).values())
        
        if consumer_total > 0:
            producer_consumer_ratio = producer_total / consumer_total
        else:
            producer_consumer_ratio = 1.0 if producer_total > 0 else 0
            
        # Resilience score
        decomposer_value = sum(biotic.get("decomposers", {}).values())
        soil_quality = sum(abiotic.get("soil", {}).values()) / len(abiotic.get("soil", {})) if abiotic.get("soil", {}) else 0
        resilience_score = (decomposer_value + soil_quality) / 2
        
        # System complexity
        succession = interactions.get("succession", {})
        complexity_score = (succession.get("mid", 0) + succession.get("climax", 0) * 1.5) / 2.5
        
        # Self-reference score 
        apex_values = biotic.get("apex_communicators", {})
        self_reference_score = apex_values.get("mountain_lion", 0) * 0.7 + apex_values.get("bear", 0) * 0.3
        
        # Authority score
        authority_score = apex_values.get("bear", 0) * 0.5 + apex_values.get("wolf", 0) * 0.3 + apex_values.get("mountain_lion", 0) * 0.2
        
        # Empathy score
        primary_consumers = biotic.get("primary_consumers", {})
        decomposers = biotic.get("decomposers", {})
        empathy_score = primary_consumers.get("bee", 0) * 0.3 + primary_consumers.get("deer", 0) * 0.3 + decomposers.get("earthworm", 0) * 0.4
        
        # Calculate trends if history exists
        trends = {}
        if self.history:
            previous = self.history[-1]
            prev_metrics = self._extract_previous_metrics(previous)
            
            trends = {
                "self_reference_trend": self_reference_score - prev_metrics.get("self_reference_score", self_reference_score),
                "authority_trend": authority_score - prev_metrics.get("authority_score", authority_score),
                "empathy_trend": empathy_score - prev_metrics.get("empathy_score", empathy_score),
                "complexity_trend": complexity_score - prev_metrics.get("complexity_score", complexity_score),
                "resilience_trend": resilience_score - prev_metrics.get("resilience_score", resilience_score)
            }
        
        return {
            "ecosystem_balance": round(min(max(producer_consumer_ratio, 0), 1), 2),
            "species_richness": species_richness,
            "evenness": round(evenness, 2),
            "dominant_species": dominant_species[0],
            "dominant_value": round(dominant_species[1], 2),
            "resilience_score": round(resilience_score, 2),
            "complexity_score": round(complexity_score, 2),
            "self_reference_score": round(self_reference_score, 2),
            "authority_score": round(authority_score, 2),
            "empathy_score": round(empathy_score, 2),
            "trends": {k: round(v, 2) for k, v in trends.items()} if trends else {}
        }
    
    def _extract_previous_metrics(self, previous_state):
        """Extract metrics from a previous state for trend calculation"""
        if not previous_state:
            return {}
            
        biotic = previous_state.get("biotic", {})
        interactions = previous_state.get("interactions", {})
        
        # Self-reference score 
        apex_values = biotic.get("apex_communicators", {})
        self_reference_score = apex_values.get("mountain_lion", 0) * 0.7 + apex_values.get("bear", 0) * 0.3
        
        # Authority score
        authority_score = apex_values.get("bear", 0) * 0.5 + apex_values.get("wolf", 0) * 0.3 + apex_values.get("mountain_lion", 0) * 0.2
        
        # Empathy score
        primary_consumers = biotic.get("primary_consumers", {})
        decomposers = biotic.get("decomposers", {})
        empathy_score = primary_consumers.get("bee", 0) * 0.3 + primary_consumers.get("deer", 0) * 0.3 + decomposers.get("earthworm", 0) * 0.4
        
        # System complexity
        succession = interactions.get("succession", {})
        complexity_score = (succession.get("mid", 0) + succession.get("climax", 0) * 1.5) / 2.5
        
        # Resilience score
        decomposer_value = sum(biotic.get("decomposers", {}).values())
        return {
            "self_reference_score": self_reference_score,
            "authority_score": authority_score,
            "empathy_score": empathy_score,
            "complexity_score": complexity_score,
            "resilience_score": decomposer_value
        }
    
    def analyze_conversation(self, messages):
        """Analyze a full conversation represented as a list of message strings"""
        results = []
        for message in messages:
            result = self.analyze_text(message)
            results.append(result)
        
        # Calculate overall conversation metrics
        overall = self._aggregate_results(results)
        
        return {
            "message_results": results,
            "overall": overall
        }
    
    def _aggregate_results(self, results):
        """Aggregate multiple results into overall conversation metrics"""
        if not results:
            return {}
            
        # Calculate averages for key metrics
        avg_metrics = {}
        for key in ["ecosystem_balance", "species_richness", "evenness", 
                   "resilience_score", "complexity_score", 
                   "self_reference_score", "authority_score", "empathy_score"]:
            values = [r.get(key, 0) for r in results]
            avg_metrics[key] = sum(values) / len(values) if values else 0
        
        # Find most common dominant species
        all_dominants = [r.get("dominant_species") for r in results if "dominant_species" in r]
        dominant_counter = Counter(all_dominants)
        most_common = dominant_counter.most_common(1)
        most_common_dominant = most_common[0][0] if most_common else "none"
        
        # Calculate overall trends
        first, last = results[0], results[-1]
        trends = {}
        for key in ["self_reference_score", "authority_score", "empathy_score", 
                   "complexity_score", "resilience_score"]:
            if key in first and key in last:
                trends[f"{key}_trend"] = last.get(key, 0) - first.get(key, 0)
        
        return {
            **avg_metrics,
            "dominant_species": most_common_dominant,
            "trends": {k: round(v, 2) for k, v in trends.items()}
        }
    
    def visualize_ecosystem(self, filename=None):
        """Generate a visualization of the current ecosystem state"""
        if not self.current_state:
            return "No ecosystem state to visualize"
        
        # Set up the figure and grid for multiple plots
        fig = plt.figure(figsize=(15, 10), facecolor='#f9f6ed')
        fig.suptitle("Communication Ecosystem Analysis", fontsize=16, y=0.98)
        
        # Plot 1: Biotic Components
        ax1 = plt.subplot2grid((2, 3), (0, 0), colspan=2)
        self._plot_ecosystem_components(ax1)
        
        # Plot 2: Key Metrics
        ax2 = plt.subplot2grid((2, 3), (0, 2))
        self._plot_key_metrics(ax2)
        
        # Plot 3: Terrain Map
        ax3 = plt.subplot2grid((2, 3), (1, 0))
        self._plot_terrain(ax3)
        
        # Plot 4: Trends
        ax4 = plt.subplot2grid((2, 3), (1, 1), colspan=2)
        self._plot_trends(ax4)
        
        plt.tight_layout(rect=[0, 0, 1, 0.96])
        
        if filename:
            plt.savefig(filename, dpi=300, bbox_inches='tight')
            return f"Visualization saved to {filename}"
        else:
            plt.show()
            return "Visualization displayed"
    
    def _plot_ecosystem_components(self, ax):
        """Plot the biotic components of the ecosystem"""
        if not self.current_state or "biotic" not in self.current_state:
            ax.text(0.5, 0.5, "No ecosystem data available", ha='center', va='center')
            return
            
        biotic = self.current_state["biotic"]
        
        # Flatten and sort components by value
        all_organisms = []
        categories = {
            "producers": "Producers",
            "primary_consumers": "Primary Consumers",
            "secondary_consumers": "Secondary Consumers",
            "apex_communicators": "Apex Communicators",
            "decomposers": "Decomposers"
        }
        
        colors = {
            "producers": "#7CB342",  # Green
            "primary_consumers": "#FFB300",  # Amber
            "secondary_consumers": "#F57C00",  # Orange
            "apex_communicators": "#D32F2F",  # Red
            "decomposers": "#6D4C41"   # Brown
        }
        
        for category, organisms in biotic.items():
            for organism, value in organisms.items():
                if value > 0.1:  # Only show organisms with significant presence
                    display_name = " ".join(word.capitalize() for word in organism.split("_"))
                    all_organisms.append((display_name, value, categories.get(category, category), colors.get(category, "#999999")))
        
        # Sort by value descending
        all_organisms.sort(key=lambda x: x[1], reverse=True)
        
        # Take top 15 for readability
        organisms_to_show = all_organisms[:15]
        
        names = [o[0] for o in organisms_to_show]
        values = [o[1] for o in organisms_to_show]
        colors = [o[3] for o in organisms_to_show]
        
        y_pos = np.arange(len(names))
        
        # Create horizontal bar chart
        bars = ax.barh(y_pos, values, align='center', color=colors, alpha=0.8)
        ax.set_yticks(y_pos)
        ax.set_yticklabels(names)
        ax.invert_yaxis()  # Labels read top-to-bottom
        ax.set_xlabel('Presence')
        ax.set_title('Ecosystem Components')
        
        # Add category legend
        handles = [plt.Rectangle((0,0),1,1, color=color) for color in colors.values()]
        labels = list(categories.values())
        ax.legend(handles, labels, loc='upper right')
        
        # Add value labels
        for i, bar in enumerate(bars):
            width = bar.get_width()
            ax.text(width + 0.01, bar.get_y() + bar.get_height()/2, f'{width:.2f}', 
                    ha='left', va='center')
    
    def _plot_key_metrics(self, ax):
        """Plot the key ecosystem metrics"""
        if not self.metrics:
            ax.text(0.5, 0.5, "No metrics available", ha='center', va='center')
            return
            
        metrics = {
            "Ecosystem Balance": self.metrics.get("ecosystem_balance", 0),
            "Resilience": self.metrics.get("resilience_score", 0),
            "Complexity": self.metrics.get("complexity_score", 0),
            "Self-Reference": self.metrics.get("self_reference_score", 0),
            "Authority": self.metrics.get("authority_score", 0),
            "Empathy": self.metrics.get("empathy_score", 0)
        }
        
        # Create colors based on values
        colors = []
        for value in metrics.values():
            if value < 0.3:
                colors.append("#D32F2F")  # Red for low values
            elif value < 0.7:
                colors.append("#FFB300")  # Amber for medium values
            else:
                colors.append("#7CB342")  # Green for high values
        
        y_pos = np.arange(len(metrics))
        
        # Create horizontal bar chart
        bars = ax.barh(y_pos, list(metrics.values()), align='center', color=colors, alpha=0.8)
        ax.set_yticks(y_pos)
        ax.set_yticklabels(metrics.keys())
        ax.invert_yaxis()  # Labels read top-to-bottom
        ax.set_xlabel('Score')
        ax.set_title('Key Metrics')
        ax.set_xlim(0, 1)
        
        # Add value labels
        for i, bar in enumerate(bars):
            width = bar.get_width()
            ax.text(width + 0.01, bar.get_y() + bar.get_height()/2, f'{width:.2f}', 
                    ha='left', va='center')
    
    def _plot_terrain(self, ax):
        """Plot the terrain composition"""
        if not self.current_state or "abiotic" not in self.current_state or "terrain" not in self.current_state["abiotic"]:
            ax.text(0.5, 0.5, "No terrain data available", ha='center', va='center')
            return
            
        terrain = self.current_state["abiotic"]["terrain"]
        
        # Sort terrain by value
        sorted_terrain = sorted(terrain.items(), key=lambda x: x[1], reverse=True)
        
        labels = [" ".join(word.capitalize() for word in name.split("_")) for name, _ in sorted_terrain]
        sizes = [value for _, value in sorted_terrain]
        
        # Custom colors for different terrain types
        colors = ['#8d6e63', '#81c784', '#4fc3f7', '#9575cd', '#fff176', '#a1887f', '#e57373']
        
        # Create pie chart
        wedges, texts, autotexts = ax.pie(sizes, labels=None, autopct='%1.1f%%', 
                                         shadow=False, startangle=90, colors=colors)
        
        # Equal aspect ratio ensures that pie is drawn as a circle
        ax.axis('equal')
        ax.set_title('Terrain Composition')
        
        # Add legend
        ax.legend(wedges, labels, title="Terrain Types", loc="center left", bbox_to_anchor=(1, 0, 0.5, 1))
    
    def _plot_trends(self, ax):
        """Plot the trends in key metrics"""
        trends = self.metrics.get("trends", {})
        
        if not trends:
            ax.text(0.5, 0.5, "No trend data available", ha='center', va='center')
            return
            
        # Prepare data
        labels = []
        values = []
        colors = []
        
        for key, value in trends.items():
            # Clean up label
            label = key.replace("_trend", "").replace("_", " ").title()
            labels.append(label)
            values.append(value)
            
            # Color based on direction and magnitude
            if value > 0.1:
                colors.append("#4CAF50")  # Significant positive - green
            elif value > 0:
                colors.append("#8BC34A")  # Slight positive - light green
            elif value > -0.1:
                colors.append("#FFC107")  # Slight negative - amber
            else:
                colors.append("#F44336")  # Significant negative - red
        
        y_pos = np.arange(len(labels))
        
        # Create bar chart
        bars = ax.bar(y_pos, values, align='center', color=colors, alpha=0.8)
        ax.set_xticks(y_pos)
        ax.set_xticklabels(labels, rotation=45, ha="right")
        ax.set_ylabel('Change')
        ax.set_title('Metric Trends')
        
        # Add zero line
        ax.axhline(y=0, color='k', linestyle='-', alpha=0.3)
        
        # Add value labels
        for bar in bars:
            height = bar.get_height()
            if height >= 0:
                va = 'bottom'
                y_pos = height + 0.01
            else:
                va = 'top'
                y_pos = height - 0.01
            ax.text(bar.get_x() + bar.get_width()/2, y_pos,
                    f'{height:.2f}', ha='center', va=va)
    
    def simulate_ecosystem(self, text_samples, verbose=True):
        """Run a complete simulation with multiple text samples and report results"""
        if verbose:
            print(f"Starting ecosystem simulation with {len(text_samples)} samples...")
        
        # Process all samples
        results = []
        for i, sample in enumerate(text_samples):
            if verbose and i % 10 == 0:
                print(f"Processing sample {i+1}/{len(text_samples)}...")
            
            metrics = self.analyze_text(sample)
            results.append({
                "sample_index": i,
                "sample_text": sample[:100] + "..." if len(sample) > 100 else sample,
                "metrics": metrics
            })
        
        # Compute aggregate statistics
        aggregate = self._compute_simulation_aggregate(results)
        
        # Generate summary
        summary = self._generate_simulation_summary(aggregate)
        
        # Format results
        simulation_results = []
        for line in summary:
            simulation_results.append(line)
        
        # Generate analysis breakdown
        analysis = {
            "dominant_patterns": aggregate["dominant_patterns"],
            "ecosystem_health": aggregate["health_assessment"],
            "key_metrics": {
                "ecosystem_balance": aggregate["avg_metrics"]["ecosystem_balance"],
                "self_reference_index": aggregate["avg_metrics"]["self_reference_score"],
                "authority_index": aggregate["avg_metrics"]["authority_score"],
                "resilience_index": aggregate["avg_metrics"]["resilience_score"],
                "trend_summary": {
                    "self_reference_trend": aggregate["trends"]["self_reference_score_trend"],
                    "authority_trend": aggregate["trends"]["authority_score_trend"],
                    "resilience_trend": aggregate["trends"]["resilience_score_trend"]
                }
            }
        }
        
        if verbose:
            print("Simulation complete.")
            print("\nSummary:")
            for line in simulation_results:
                print(line)
            
        return {
            "simulation": simulation_results,
            "analysis": analysis,
            "raw_results": results,
            "aggregate": aggregate
        }
    
    def _compute_simulation_aggregate(self, results):
        """Compute aggregate statistics from simulation results"""
        if not results:
            return {}
            
        # Extract metrics
        all_metrics = [r["metrics"] for r in results]
        
        # Calculate average metrics
        avg_metrics = {}
        for key in ["ecosystem_balance", "species_richness", "evenness", 
                   "resilience_score", "complexity_score", 
                   "self_reference_score", "authority_score", "empathy_score"]:
            values = [m.get(key, 0) for m in all_metrics]
            avg_metrics[key] = sum(values) / len(values) if values else 0
        
        # Find most common dominant species
        all_dominants = [m.get("dominant_species") for m in all_metrics if "dominant_species" in m]
        dominant_counter = Counter(all_dominants)
        dominant_patterns = dominant_counter.most_common(5)
        
        # Calculate overall trends
        first_metrics, last_metrics = all_metrics[0], all_metrics[-1]
        trends = {}
        for key in ["self_reference_score", "authority_score", "empathy_score", 
                   "complexity_score", "resilience_score"]:
            if key in first_metrics and key in last_metrics:
                trends[f"{key}_trend"] = last_metrics.get(key, 0) - first_metrics.get(key, 0)
        
        # Count all species occurrences
        species_counter = Counter()
        for result in results:
            biotic = result.get("biotic", {})
            for category in biotic.values():
                for species, value in category.items():
                    if value > 0.3:  # Only count significant presence
                        species_counter[species] += 1
        
        # Health assessment
        health_assessment = self._assess_ecosystem_health(avg_metrics, trends)
        
        return {
            "avg_metrics": avg_metrics,
            "dominant_patterns": dominant_patterns,
            "trends": trends,
            "species_frequency": species_counter.most_common(10),
            "health_assessment": health_assessment
        }
    
    def _assess_ecosystem_health(self, metrics, trends):
        """Assess the overall health of the ecosystem based on metrics and trends"""
        # Balance assessment
        if metrics["ecosystem_balance"] < 0.3:
            balance = "Low producer presence - information consumption exceeds production"
        elif metrics["ecosystem_balance"] > 0.7:
            balance = "Producer dominance - high information output with limited processing"
        else:
            balance = "Healthy producer-consumer balance - sustainable information exchange"
        
        # Diversity assessment
        if metrics["species_richness"] < 5:
            diversity = "Low diversity - limited communication patterns"
        elif metrics["species_richness"] > 10:
            diversity = "High diversity - varied communication strategies"
        else:
            diversity = "Moderate diversity - stable communication patterns"
        
        # Resilience assessment
        if metrics["resilience_score"] < 0.3:
            resilience = "Low resilience - vulnerable to conversational disruption"
        elif metrics["resilience_score"] > 0.7:
            resilience = "High resilience - strong adaptive capacity"
        else:
            resilience = "Moderate resilience - adequate response to challenges"
        
        # Trend assessment
        trend_concerns = []
        if trends.get("self_reference_score_trend", 0) > 0.1:
            trend_concerns.append("increasing self-reference")
        if trends.get("authority_score_trend", 0) > 0.1:
            trend_concerns.append("increasing authority assertion")
        if trends.get("empathy_score_trend", 0) < -0.1:
            trend_concerns.append("decreasing empathy")
        
        if trend_concerns:
            trend_assessment = f"Concerning trends: {', '.join(trend_concerns)}"
        else:
            trend_assessment = "Stable or improving trends across key metrics"
        
        # Overall health
        narcissism_risk = metrics["self_reference_score"] * 0.4 + metrics["authority_score"] * 0.4 - metrics["empathy_score"] * 0.2
        
        if narcissism_risk > 0.6:
            overall = "High concern - significant narcissistic communication patterns"
        elif narcissism_risk > 0.4:
            overall = "Moderate concern - some narcissistic tendencies present"
        elif narcissism_risk > 0.2:
            overall = "Low concern - minimal narcissistic patterns"
        else:
            overall = "Healthy - balanced communication ecosystem"
        
        return {
            "balance": balance,
            "diversity": diversity,
            "resilience": resilience,
            "trends": trend_assessment,
            "overall": overall,
            "narcissism_risk_score": round(narcissism_risk, 2)
        }
    
    def _generate_simulation_summary(self, aggregate):
        """Generate a narrative summary of the simulation results"""
        summary = []
        
        # Introduction
        summary.append("Ecosystem Analysis Complete")
        summary.append("-" * 30)
        
        # Dominant patterns section
        dominant_patterns = aggregate.get("dominant_patterns", [])
        if dominant_patterns:
            top_pattern = dominant_patterns[0][0]
            top_pattern_display = " ".join(word.capitalize() for word in top_pattern.split("_"))
            summary.append(f"Primary Element: {top_pattern_display}")
            
            # Element frequencies
            summary.append("\nElement Frequencies:")
            for element, count in dominant_patterns:
                element_display = " ".join(word.capitalize() for word in element.split("_"))
                summary.append(f"{element_display}: {count}")
        
        # Metrics summary
        metrics = aggregate.get("avg_metrics", {})
        if metrics:
            summary.append("\nKey Indicators:")
            labels = {
                "ecosystem_balance": "Sustainability Score",
                "self_reference_score": "Resource Index",
                "authority_score": "Territory Index",
                "resilience_score": "Resilience Index",
                "empathy_score": "Empathy Score"
            }
            
            for key, label in labels.items():
                if key in metrics:
                    summary.append(f"{label}: {metrics[key]:.2f}")
        
        # Trends
        trends = aggregate.get("trends", {})
        if trends:
            summary.append("\nTrend Analysis:")
            trend_labels = {
                "self_reference_score_trend": "Resource Trend",
                "authority_score_trend": "Territory Trend",
                "resilience_score_trend": "Resilience Trend"
            }
            
            for key, label in trend_labels.items():
                if key in trends:
                    value = trends[key]
                    sign = "+" if value > 0 else ""
                    summary.append(f"{label}: {sign}{value:.2f}")
        
        # Health assessment
        health = aggregate.get("health_assessment", {})
        if health:
            summary.append("\nInterpretation:")
            interpretation = []
            
            # Format the narcissism score with a disguised label
            if "narcissism_risk_score" in health:
                interpretation.append(f"Resource Competition Index: {health['narcissism_risk_score']}")
                
                # Add interpretation
                if health["narcissism_risk_score"] < 0.2:
                    interpretation.append("Low resource competition - collaborative ecosystem")
                elif health["narcissism_risk_score"] < 0.4:
                    interpretation.append("Moderate resource allocation - functioning ecosystem")
                elif health["narcissism_risk_score"] < 0.6:
                    interpretation.append("Elevated competition - stress indicators present")
                else:
                    interpretation.append("High competition - ecosystem imbalance detected")
                
            for line in interpretation:
                summary.append(line)
        
        return summary

    def export_results(self, filename):
        """Export the current state and metrics to a JSON file"""
        if not self.current_state:
            return "No data to export"
            
        data = {
            "timestamp": datetime.now().isoformat(),
            "state": self.current_state,
            "metrics": self.metrics,
            "history_length": len(self.history)
        }
        
        with open(filename, 'w') as f:
            json.dump(data, f, indent=2)
            
        return f"Data exported to {filename}"

# Example usage
def run_demo():
    # Create the ecosystem analyzer
    analyzer = CommunicationEcosystem()
    
    # Sample texts with different communication patterns
    samples = [
        # Self-reference heavy
        "I believe my approach is the best way to solve this problem. My experience has shown me that I'm right about this issue. If you look at my track record, you'll see that I've consistently been correct in my assessments.",
        
        # Authority heavy
        "This is definitely the correct approach. Everyone must follow these guidelines without exception. There is absolutely no room for debate on this matter. These rules must be followed precisely.",
        
        # Balanced collaborative
        "Let's explore this issue together. What do you think about approaching it from this angle? We might find that combining our perspectives leads to a better solution. I'd value hearing your thoughts on this.",
        
        # Question-rich
        "Have you considered looking at the problem differently? What if we tried a new approach? Could there be factors we haven't accounted for? How would this solution work in different contexts?",
        
        # Fact-oriented
        "Research shows that this approach has a 75% success rate. The data indicates three main factors affecting outcomes. These patterns have been consistent across multiple studies. The evidence supports implementing this solution."
    ]
    
    # Run simulation with all samples
    results = analyzer.simulate_ecosystem(samples)
    
    # Visualize the final state
    analyzer.visualize_ecosystem("ecosystem_visualization.png")
    
    # Export results
    analyzer.export_results("ecosystem_analysis.json")
    
    return results

# Simple text analysis function for direct use
def analyze_text(text):
    """Quick analysis of a single text sample"""
    analyzer = CommunicationEcosystem()
    results = analyzer.analyze_text(text)
    return results

# CLI interface for the tool
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Communication Ecosystem Analyzer')
    subparsers = parser.add_subparsers(dest='command', help='Command to run')
    
    # Analyze a single text
    analyze_parser = subparsers.add_parser('analyze', help='Analyze a single text')
    analyze_parser.add_argument('text', help='Text to analyze')
    
    # Analyze multiple texts from a file
    file_parser = subparsers.add_parser('file', help='Analyze text
