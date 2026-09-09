import math
from datetime import datetime

class FeatureEngine:
    @staticmethod
    def calculate_features(project_data: dict) -> dict:
        """
        Feature Engineering (Section 31 of implementation.md)
        Calculates key derived metrics from raw project metrics.
        """
        sanctioned = float(project_data.get("sanctionedAmount", 0) or 0)
        estimated = float(project_data.get("estimatedCost", 0) or sanctioned or 1)
        actual = float(project_data.get("actualCost", 0) or 0)
        expenditure = float(project_data.get("expenditure", 0) or 0)
        
        physical_progress = float(project_data.get("physicalProgress", 0) or 0)
        financial_progress = float(project_data.get("financialProgress", 0) or 0)

        # If financial progress wasn't explicitly supplied, compute from expenditure ratio
        if financial_progress == 0 and sanctioned > 0:
            financial_progress = round((expenditure / sanctioned) * 100, 2)

        # 1. Cost Deviation %: ((Actual Cost - Estimated Cost) / Estimated Cost) * 100
        cost_deviation = 0.0
        if estimated > 0 and actual > 0:
            cost_deviation = round(((actual - estimated) / estimated) * 100, 2)

        # 2. Expenditure Ratio %: (Expenditure / Sanctioned Amount) * 100
        expenditure_ratio = 0.0
        if sanctioned > 0:
            expenditure_ratio = round((expenditure / sanctioned) * 100, 2)

        # 3. Progress Gap %: Financial Progress - Physical Progress
        progress_gap = round(financial_progress - physical_progress, 2)

        # 4. Remaining Amount: Sanctioned Amount - Expenditure
        remaining_amount = round(max(0.0, sanctioned - expenditure), 2)

        # 5. Delay Days calculation
        delay_days = int(project_data.get("delayDays", 0) or 0)
        expected_completion = project_data.get("expectedCompletionDate")
        if delay_days == 0 and expected_completion:
            try:
                exp_date = datetime.strptime(str(expected_completion)[:10], "%Y-%m-%d")
                if exp_date < datetime.now():
                    delay_days = (datetime.now() - exp_date).days
            except Exception:
                pass

        return {
            "sanctionedAmount": sanctioned,
            "estimatedCost": estimated,
            "actualCost": actual,
            "expenditure": expenditure,
            "remainingAmount": remaining_amount,
            "physicalProgress": physical_progress,
            "financialProgress": financial_progress,
            "costDeviation": cost_deviation,
            "expenditureRatio": expenditure_ratio,
            "progressGap": progress_gap,
            "delayDays": max(0, delay_days)
        }
