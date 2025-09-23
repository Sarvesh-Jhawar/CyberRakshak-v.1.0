import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Optional
import os
from pathlib import Path

class MLModelManager:
    def __init__(self, models_path: str = "../models"):
        self.models_path = Path(models_path)
        self.models = {}
        self.load_models()
    
    def load_models(self):
        """Load all available ML models"""
        try:
            # Load Malware Detection Model
            malware_model_path = self.models_path / "malware" / "models" / "malware_rf_model.pkl"
            malware_features_path = self.models_path / "malware" / "models" / "malware_features.pkl"
            
            if malware_model_path.exists() and malware_features_path.exists():
                self.models["malware"] = {
                    "model": joblib.load(malware_model_path),
                    "features": joblib.load(malware_features_path)
                }
                print("Malware detection model loaded successfully")
            
            # Load Phishing Detection Model
            phishing_model_path = self.models_path / "phishing" / "models" / "phishing_rf_model.pkl"
            phishing_features_path = self.models_path / "phishing" / "models" / "phishing_features.pkl"
            
            if phishing_model_path.exists() and phishing_features_path.exists():
                self.models["phishing"] = {
                    "model": joblib.load(phishing_model_path),
                    "features": joblib.load(phishing_features_path)
                }
                print("Phishing detection model loaded successfully")
            
            # Load Ransomware Detection Model
            ransomware_model_path = self.models_path / "Ransomware" / "models" / "ransomware_rf_model.pkl"
            
            if ransomware_model_path.exists():
                self.models["ransomware"] = {
                    "model": joblib.load(ransomware_model_path),
                    "features": None  # Ransomware model might not have separate features file
                }
                print("Ransomware detection model loaded successfully")
                
        except Exception as e:
            print(f"Error loading ML models: {e}")
    
    def predict_malware(self, file_features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict if a file is malware"""
        if "malware" not in self.models:
            return {"prediction": "unknown", "confidence": 0.0, "error": "Model not available"}
        
        try:
            model = self.models["malware"]["model"]
            features = self.models["malware"]["features"]
            
            # Prepare feature vector
            feature_vector = self._prepare_malware_features(file_features, features)
            
            # Make prediction
            prediction = model.predict([feature_vector])[0]
            probability = model.predict_proba([feature_vector])[0]
            
            return {
                "prediction": "malware" if prediction == 1 else "benign",
                "confidence": float(max(probability)),
                "probability_malware": float(probability[1]) if len(probability) > 1 else 0.0
            }
        except Exception as e:
            return {"prediction": "error", "confidence": 0.0, "error": str(e)}
    
    def predict_phishing(self, url_features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict if a URL is phishing"""
        if "phishing" not in self.models:
            return {"prediction": "unknown", "confidence": 0.0, "error": "Model not available"}
        
        try:
            model = self.models["phishing"]["model"]
            features = self.models["phishing"]["features"]
            
            # Prepare feature vector
            feature_vector = self._prepare_phishing_features(url_features, features)
            
            # Make prediction
            prediction = model.predict([feature_vector])[0]
            probability = model.predict_proba([feature_vector])[0]
            
            return {
                "prediction": "phishing" if prediction == 1 else "legitimate",
                "confidence": float(max(probability)),
                "probability_phishing": float(probability[1]) if len(probability) > 1 else 0.0
            }
        except Exception as e:
            return {"prediction": "error", "confidence": 0.0, "error": str(e)}
    
    def predict_ransomware(self, file_features: Dict[str, Any]) -> Dict[str, Any]:
        """Predict if a file is ransomware"""
        if "ransomware" not in self.models:
            return {"prediction": "unknown", "confidence": 0.0, "error": "Model not available"}
        
        try:
            model = self.models["ransomware"]["model"]
            
            # Prepare feature vector (simplified for ransomware)
            feature_vector = self._prepare_ransomware_features(file_features)
            
            # Make prediction
            prediction = model.predict([feature_vector])[0]
            probability = model.predict_proba([feature_vector])[0]
            
            return {
                "prediction": "ransomware" if prediction == 1 else "benign",
                "confidence": float(max(probability)),
                "probability_ransomware": float(probability[1]) if len(probability) > 1 else 0.0
            }
        except Exception as e:
            return {"prediction": "error", "confidence": 0.0, "error": str(e)}
    
    def _prepare_malware_features(self, file_features: Dict[str, Any], expected_features: list) -> list:
        """Prepare feature vector for malware detection"""
        feature_vector = []
        
        # Map common file features to expected model features
        feature_mapping = {
            "file_size": file_features.get("file_size", 0),
            "entropy": file_features.get("entropy", 0),
            "strings_count": file_features.get("strings_count", 0),
            "imports_count": file_features.get("imports_count", 0),
            "exports_count": file_features.get("exports_count", 0),
            "sections_count": file_features.get("sections_count", 0),
            "has_imports": 1 if file_features.get("has_imports", False) else 0,
            "has_exports": 1 if file_features.get("has_exports", False) else 0,
            "is_packed": 1 if file_features.get("is_packed", False) else 0,
            "has_anti_debug": 1 if file_features.get("has_anti_debug", False) else 0
        }
        
        # Create feature vector in the order expected by the model
        for feature in expected_features:
            feature_vector.append(feature_mapping.get(feature, 0))
        
        return feature_vector
    
    def _prepare_phishing_features(self, url_features: Dict[str, Any], expected_features: list) -> list:
        """Prepare feature vector for phishing detection"""
        feature_vector = []
        
        # Map URL features to expected model features
        feature_mapping = {
            "url_length": url_features.get("url_length", 0),
            "domain_length": url_features.get("domain_length", 0),
            "path_length": url_features.get("path_length", 0),
            "query_length": url_features.get("query_length", 0),
            "has_ip": 1 if url_features.get("has_ip", False) else 0,
            "has_shortener": 1 if url_features.get("has_shortener", False) else 0,
            "has_suspicious_keywords": 1 if url_features.get("has_suspicious_keywords", False) else 0,
            "has_https": 1 if url_features.get("has_https", False) else 0,
            "subdomain_count": url_features.get("subdomain_count", 0),
            "special_char_count": url_features.get("special_char_count", 0)
        }
        
        # Create feature vector in the order expected by the model
        for feature in expected_features:
            feature_vector.append(feature_mapping.get(feature, 0))
        
        return feature_vector
    
    def _prepare_ransomware_features(self, file_features: Dict[str, Any]) -> list:
        """Prepare feature vector for ransomware detection"""
        # Simplified feature vector for ransomware detection
        return [
            file_features.get("file_size", 0),
            file_features.get("entropy", 0),
            file_features.get("strings_count", 0),
            file_features.get("imports_count", 0),
            file_features.get("sections_count", 0),
            1 if file_features.get("has_encryption", False) else 0,
            1 if file_features.get("has_network_activity", False) else 0,
            1 if file_features.get("has_file_operations", False) else 0
        ]
    
    def analyze_incident(self, incident_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze incident using appropriate ML models"""
        category = incident_data.get("category", "").lower()
        description = incident_data.get("description", "")
        evidence_url = incident_data.get("evidence_url", "")
        evidence_text = incident_data.get("evidence_text", "")
        
        analysis_results = {
            "category": category,
            "ml_analysis": {},
            "risk_score": 0.0,
            "recommendations": []
        }
        
        # Analyze based on category
        if category == "malware" and evidence_text:
            # Extract file features from evidence text
            file_features = self._extract_file_features(evidence_text)
            ml_result = self.predict_malware(file_features)
            analysis_results["ml_analysis"]["malware"] = ml_result
            
        elif category == "phishing" and evidence_url:
            # Extract URL features
            url_features = self._extract_url_features(evidence_url)
            ml_result = self.predict_phishing(url_features)
            analysis_results["ml_analysis"]["phishing"] = ml_result
            
        elif category == "malware" and "ransomware" in description.lower():
            # Check for ransomware
            file_features = self._extract_file_features(evidence_text)
            ml_result = self.predict_ransomware(file_features)
            analysis_results["ml_analysis"]["ransomware"] = ml_result
        
        # Calculate overall risk score
        analysis_results["risk_score"] = self._calculate_risk_score(analysis_results["ml_analysis"])
        
        # Generate recommendations
        analysis_results["recommendations"] = self._generate_recommendations(analysis_results)
        
        return analysis_results
    
    def _extract_file_features(self, evidence_text: str) -> Dict[str, Any]:
        """Extract file features from evidence text"""
        # This is a simplified feature extraction
        # In a real implementation, you would analyze the actual file
        return {
            "file_size": len(evidence_text) * 100,  # Mock file size
            "entropy": 7.5,  # Mock entropy
            "strings_count": evidence_text.count(" ") + 1,
            "imports_count": evidence_text.count("import") + evidence_text.count("require"),
            "exports_count": evidence_text.count("export"),
            "sections_count": 5,  # Mock sections
            "has_imports": "import" in evidence_text.lower(),
            "has_exports": "export" in evidence_text.lower(),
            "is_packed": False,
            "has_anti_debug": False,
            "has_encryption": "encrypt" in evidence_text.lower(),
            "has_network_activity": "http" in evidence_text.lower(),
            "has_file_operations": "file" in evidence_text.lower()
        }
    
    def _extract_url_features(self, url: str) -> Dict[str, Any]:
        """Extract URL features for phishing detection"""
        return {
            "url_length": len(url),
            "domain_length": len(url.split("/")[2]) if "//" in url else 0,
            "path_length": len(url.split("/")[-1]) if "/" in url else 0,
            "query_length": len(url.split("?")[1]) if "?" in url else 0,
            "has_ip": any(char.isdigit() for char in url),
            "has_shortener": any(shortener in url for shortener in ["bit.ly", "tinyurl", "goo.gl"]),
            "has_suspicious_keywords": any(keyword in url.lower() for keyword in ["login", "secure", "verify"]),
            "has_https": url.startswith("https://"),
            "subdomain_count": url.count(".") - 1,
            "special_char_count": sum(1 for char in url if not char.isalnum() and char not in ".-/")
        }
    
    def _calculate_risk_score(self, ml_analysis: Dict[str, Any]) -> float:
        """Calculate overall risk score based on ML analysis"""
        risk_score = 0.0
        
        for model_type, result in ml_analysis.items():
            if result.get("prediction") in ["malware", "phishing", "ransomware"]:
                confidence = result.get("confidence", 0.0)
                risk_score += confidence * 0.5  # Weight ML confidence
        
        return min(risk_score, 1.0)  # Cap at 1.0
    
    def _generate_recommendations(self, analysis: Dict[str, Any]) -> list:
        """Generate recommendations based on analysis"""
        recommendations = []
        
        ml_analysis = analysis.get("ml_analysis", {})
        risk_score = analysis.get("risk_score", 0.0)
        
        if risk_score > 0.7:
            recommendations.append("High risk detected - immediate investigation required")
            recommendations.append("Isolate affected systems immediately")
            recommendations.append("Notify security team and management")
        
        if "malware" in ml_analysis and ml_analysis["malware"].get("prediction") == "malware":
            recommendations.append("Run full system scan with updated antivirus")
            recommendations.append("Check for lateral movement in network")
        
        if "phishing" in ml_analysis and ml_analysis["phishing"].get("prediction") == "phishing":
            recommendations.append("Block suspicious URL immediately")
            recommendations.append("Check for compromised accounts")
            recommendations.append("Send security awareness notification")
        
        if "ransomware" in ml_analysis and ml_analysis["ransomware"].get("prediction") == "ransomware":
            recommendations.append("CRITICAL: Ransomware detected - activate incident response plan")
            recommendations.append("Disconnect affected systems from network")
            recommendations.append("Contact law enforcement and cyber insurance")
        
        return recommendations

# Global ML model manager instance
ml_manager = MLModelManager()
