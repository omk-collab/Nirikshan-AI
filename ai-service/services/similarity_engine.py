import re
import math

class SimilarityEngine:
    @staticmethod
    def _simple_cosine_similarity(text1: str, text2: str) -> float:
        """Fallback n-gram / word term frequency cosine similarity for fast lightweight execution."""
        words1 = re.findall(r'\w+', text1.lower())
        words2 = re.findall(r'\w+', text2.lower())

        freq1 = {}
        for w in words1:
            freq1[w] = freq1.get(w, 0) + 1

        freq2 = {}
        for w in words2:
            freq2[w] = freq2.get(w, 0) + 1

        all_words = set(freq1.keys()).union(set(freq2.keys()))
        if not all_words:
            return 0.0

        dot_product = sum(freq1.get(w, 0) * freq2.get(w, 0) for w in all_words)
        magnitude1 = math.sqrt(sum(v**2 for v in freq1.values()))
        magnitude2 = math.sqrt(sum(v**2 for v in freq2.values()))

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)

    @classmethod
    def compare_descriptions(cls, target_description: str, corpus: list) -> list:
        """
        Sentence / Text Semantic Similarity Check (Section 29 of implementation.md)
        Identifies potentially similar project work descriptions.
        """
        results = []
        try:
            # Try importing SentenceTransformer if installed and loaded
            from sentence_transformers import SentenceTransformer, util
            model = SentenceTransformer('all-MiniLM-L6-v2')
            embeddings1 = model.encode(target_description, convert_to_tensor=True)
            
            for item in corpus:
                desc = item.get("description", "")
                if not desc or item.get("projectId") == item.get("targetProjectId"):
                    continue
                
                embeddings2 = model.encode(desc, convert_to_tensor=True)
                sim_score = float(util.cos_sim(embeddings1, embeddings2)[0][0])
                
                if sim_score > 0.45:
                    results.append({
                        "projectId": item.get("projectId"),
                        "projectName": item.get("projectName") or item.get("description"),
                        "workType": item.get("workType"),
                        "location": f"{item.get('district', '')}, {item.get('state', '')}",
                        "sanctionedAmount": item.get("sanctionedAmount"),
                        "similarityScore": round(sim_score * 100, 1),
                        "advisoryTag": "Potentially Similar Work" if sim_score > 0.70 else "Moderately Similar Proposal"
                    })
        except Exception:
            # Fallback to word-frequency cosine similarity
            for item in corpus:
                desc = item.get("description", "")
                if not desc:
                    continue
                
                sim_score = cls._simple_cosine_similarity(target_description, desc)
                if sim_score > 0.40:
                    results.append({
                        "projectId": item.get("projectId"),
                        "projectName": item.get("projectName") or item.get("description"),
                        "workType": item.get("workType"),
                        "location": f"{item.get('district', '')}, {item.get('state', '')}",
                        "sanctionedAmount": item.get("sanctionedAmount"),
                        "similarityScore": round(sim_score * 100, 1),
                        "advisoryTag": "Potentially Similar Work" if sim_score > 0.65 else "Moderately Similar Proposal"
                    })

        results.sort(key=lambda x: x["similarityScore"], reverse=True)
        return results

    @staticmethod
    def calculate_peer_risk(target_project: dict, peer_projects: list) -> dict:
        """
        Peer Group Comparison (Section 34 of implementation.md)
        Compares target project cost and duration against median of peer district/work-type group.
        """
        if not peer_projects:
            return {"peerRisk": 20, "peerDeviationPct": 0.0, "peerMedianCost": target_project.get("estimatedCost", 0)}

        costs = [p.get("estimatedCost", 0) for p in peer_projects if p.get("estimatedCost", 0) > 0]
        if not costs:
            return {"peerRisk": 20, "peerDeviationPct": 0.0, "peerMedianCost": target_project.get("estimatedCost", 0)}

        costs.sort()
        mid = len(costs) // 2
        median_cost = costs[mid] if len(costs) % 2 != 0 else (costs[mid - 1] + costs[mid]) / 2.0

        target_cost = float(target_project.get("actualCost", 0) or target_project.get("estimatedCost", 0))
        
        dev_pct = 0.0
        if median_cost > 0:
            dev_pct = round(((target_cost - median_cost) / median_cost) * 100, 2)

        peer_risk = 15
        if dev_pct > 60:
            peer_risk = 85
        elif dev_pct > 30:
            peer_risk = 60
        elif dev_pct > 15:
            peer_risk = 35

        return {
            "peerRisk": peer_risk,
            "peerDeviationPct": dev_pct,
            "peerMedianCost": median_cost,
            "peerGroupCount": len(peer_projects)
        }
