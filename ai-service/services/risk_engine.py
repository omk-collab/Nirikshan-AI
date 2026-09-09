from .feature_engine import FeatureEngine
from .rule_engine import RuleEngine
from .anomaly_engine import anomaly_engine_instance
from .similarity_engine import SimilarityEngine
from .photo_engine import PhotoEngine

class RiskEngine:
    @classmethod
    def evaluate_project_risk(cls, project_data: dict, peer_projects: list = None, similar_corpus: list = None) -> dict:
        """
        Unified Risk Engine (Sections 35 & 36 of implementation.md)
        Combines 7 weighted risk dimensions into a single 0-100 risk score and level.
        """
        # 1. Feature Engineering
        features = FeatureEngine.calculate_features(project_data)

        # 2. Rule-Based Indicators
        rule_result = RuleEngine.evaluate_rules(features)

        # 3. Isolation Forest Anomaly Detection
        anomaly_result = anomaly_engine_instance.predict_anomaly(features)

        # 4. Peer Comparison
        peer_result = SimilarityEngine.calculate_peer_risk(project_data, peer_projects or [])

        # 5. Semantic Similarity
        target_desc = project_data.get("description", "")
        similar_matches = SimilarityEngine.compare_descriptions(target_desc, similar_corpus or [])
        similarity_risk = 30
        if similar_matches and similar_matches[0]["similarityScore"] > 70:
            similarity_risk = 80
        elif similar_matches and similar_matches[0]["similarityScore"] > 50:
            similarity_risk = 55

        # 6. Photo Risk
        photo_risk = int(project_data.get("photoRisk", 15))

        # Weighting Allocation (Section 35)
        financial_risk = rule_result["financialRisk"]
        progress_risk = rule_result["progressRisk"]
        delay_risk = rule_result["delayRisk"]
        ml_risk = anomaly_result["mlRisk"]
        peer_risk = peer_result["peerRisk"]

        overall_score = round(
            (financial_risk * 0.25) +
            (progress_risk * 0.25) +
            (delay_risk * 0.15) +
            (ml_risk * 0.15) +
            (photo_risk * 0.10) +
            (peer_risk * 0.05) +
            (similarity_risk * 0.05)
        )

        overall_score = max(0, min(100, overall_score))

        # Risk Thresholds
        if overall_score > 80:
            risk_level = "CRITICAL"
        elif overall_score > 60:
            risk_level = "HIGH"
        elif overall_score > 30:
            risk_level = "MEDIUM"
        else:
            risk_level = "LOW"

        # Recommendations Generation (Section 37)
        recommendations = []
        if financial_risk > 60:
            recommendations.append("Review expenditure records and authorized payment milestone vouchers.")
        if progress_risk > 60:
            recommendations.append("Order immediate physical site measurement audit by District Technical Committee.")
        if delay_risk > 60:
            recommendations.append("Request revised project completion schedule and penalty enforcement review.")
        if photo_risk > 50:
            recommendations.append("Verify geotagged site inspection photographs against GIS boundaries.")
        if similarity_risk > 60:
            recommendations.append("Cross-reference proposal text with nearby completed works to rule out duplicate funding.")

        if not recommendations:
            recommendations.append("Maintain routine monitoring and quarter progress reporting.")

        return {
            "projectId": project_data.get("projectId", "MPLADS-001"),
            "features": features,
            "financialRisk": financial_risk,
            "progressRisk": progress_risk,
            "delayRisk": delay_risk,
            "mlRisk": ml_risk,
            "photoRisk": photo_risk,
            "peerRisk": peer_risk,
            "similarityRisk": similarity_risk,
            "overallRisk": overall_score,
            "riskLevel": risk_level,
            "isAnomaly": anomaly_result["isAnomaly"],
            "anomalyScore": anomaly_result["anomalyScore"],
            "anomalyConfidence": anomaly_result["anomalyConfidence"],
            "indicators": rule_result["indicators"],
            "reasons": rule_result["reasons"],
            "recommendations": recommendations,
            "similarProjects": similar_matches[:3]
        }
