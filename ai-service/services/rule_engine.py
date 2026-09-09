class RuleEngine:
    @staticmethod
    def evaluate_rules(features: dict) -> dict:
        """
        Rule-Based Risk Evaluation (Section 32 of implementation.md)
        Produces heuristic risk indicators, component risk scores, and explainable reasons.
        """
        indicators = []
        reasons = []

        cost_dev = features.get("costDeviation", 0)
        gap = features.get("progressGap", 0)
        delay = features.get("delayDays", 0)
        exp_ratio = features.get("expenditureRatio", 0)
        fin_prog = features.get("financialProgress", 0)
        phys_prog = features.get("physicalProgress", 0)

        # 1. Financial Risk Calculation (Cost deviation & expenditure ratio anomalies)
        financial_risk = 10
        if cost_dev > 50:
            financial_risk = 90
            indicators.append({
                "indicator": "HIGH_COST_DEVIATION",
                "severity": "CRITICAL",
                "value": f"+{cost_dev}%",
                "message": "Actual cost exceeds estimate by over 50%"
            })
            reasons.append(f"Severe cost escalation detected: Actual cost is {cost_dev}% above estimated budget.")
        elif cost_dev > 25:
            financial_risk = 70
            indicators.append({
                "indicator": "MODERATE_COST_DEVIATION",
                "severity": "HIGH",
                "value": f"+{cost_dev}%",
                "message": "Actual cost exceeds estimate by over 25%"
            })
            reasons.append(f"Notable cost deviation: Actual cost is {cost_dev}% higher than baseline estimate.")
        elif cost_dev > 10:
            financial_risk = 45
        
        if exp_ratio > 95 and phys_prog < 60:
            financial_risk = max(financial_risk, 85)
            indicators.append({
                "indicator": "EXPENDITURE_SPIKE",
                "severity": "HIGH",
                "value": f"{exp_ratio}% spent, {phys_prog}% physical",
                "message": "Fund utilization near completion with physical progress lagging"
            })
            reasons.append("Fund exhaustion warning: Over 95% of sanctioned funds expended while physical work is incomplete.")

        # 2. Progress Mismatch Risk Calculation
        progress_risk = 10
        if gap > 40:
            progress_risk = 95
            indicators.append({
                "indicator": "PROGRESS_MISMATCH",
                "severity": "CRITICAL",
                "value": f"Gap: {gap}%",
                "message": "Financial progress significantly exceeds physical progress"
            })
            reasons.append(f"Critical progress gap: Financial disbursal ({fin_prog}%) exceeds physical completion ({phys_prog}%) by {gap}%.")
        elif gap > 20:
            progress_risk = 70
            indicators.append({
                "indicator": "PROGRESS_MISMATCH",
                "severity": "HIGH",
                "value": f"Gap: {gap}%",
                "message": "Noticeable mismatch between financial drawdown and physical progress"
            })
            reasons.append(f"Progress mismatch: Financial progress is {gap}% ahead of verified physical work.")
        elif gap > 10:
            progress_risk = 40

        # 3. Delay Risk Calculation
        delay_risk = 5
        if delay > 180:
            delay_risk = 90
            indicators.append({
                "indicator": "SEVERE_DELAY",
                "severity": "CRITICAL",
                "value": f"{delay} days",
                "message": "Project is delayed by more than 6 months past target completion"
            })
            reasons.append(f"Severe schedule delay: Project is {delay} days overdue.")
        elif delay > 60:
            delay_risk = 70
            indicators.append({
                "indicator": "MODERATE_DELAY",
                "severity": "HIGH",
                "value": f"{delay} days",
                "message": "Project timeline breached by over 60 days"
            })
            reasons.append(f"Project delay: Implementation is lagging {delay} days behind schedule.")
        elif delay > 0:
            delay_risk = 35

        return {
            "financialRisk": financial_risk,
            "progressRisk": progress_risk,
            "delayRisk": delay_risk,
            "indicators": indicators,
            "reasons": reasons
        }
