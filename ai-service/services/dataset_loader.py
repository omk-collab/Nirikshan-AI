import os
import csv

DATASET_PATH_RS = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Allocated Limit for Honble MPs.csv")
DATASET_PATH_LS = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "Allocated Limit for Honble MPs (1).csv")

class OfficialDatasetLoader:
    @classmethod
    def load_mp_allocations(cls) -> list:
        """
        Parses official MoSPI MPLADS dataset CSVs for Lok Sabha & Rajya Sabha MPs.
        Extracts State, MP Name, House (LS/RS), Constituency/Nominated status, and Official Allocated Amount (₹).
        """
        allocations = []

        # 1. Load Rajya Sabha dataset
        if os.path.exists(DATASET_PATH_RS):
            try:
                with open(DATASET_PATH_RS, mode="r", encoding="utf-8-sig") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        state = row.get("State", "").strip()
                        mp_name = row.get("Hon'ble Members of Parliament", "").strip()
                        category = row.get("Elected/Nominated", "").strip()
                        raw_amount = row.get("Allocated AMOUNT ( ₹ )", "0").strip().replace(",", "")
                        try:
                            amount = float(raw_amount)
                        except ValueError:
                            amount = 0.0

                        if mp_name:
                            allocations.append({
                                "house": "Rajya Sabha",
                                "state": state,
                                "mpName": mp_name,
                                "constituency": category or "Rajya Sabha",
                                "allocatedAmount": amount,
                                "category": category
                            })
            except Exception as e:
                print(f"[DatasetLoader] Error parsing Rajya Sabha CSV: {e}")

        # 2. Load Lok Sabha dataset
        if os.path.exists(DATASET_PATH_LS):
            try:
                with open(DATASET_PATH_LS, mode="r", encoding="utf-8-sig") as f:
                    reader = csv.DictReader(f)
                    for row in reader:
                        state = row.get("State", "").strip()
                        mp_name = row.get("Hon'ble Members of Parliaments", "").strip()
                        constituency = row.get("Constituency", "").strip()
                        raw_amount = row.get("Allocated AMOUNT ( ₹ )", "0").strip().replace(",", "")
                        try:
                            amount = float(raw_amount)
                        except ValueError:
                            amount = 0.0

                        if mp_name:
                            allocations.append({
                                "house": "Lok Sabha",
                                "state": state,
                                "mpName": mp_name,
                                "constituency": constituency or "Lok Sabha",
                                "allocatedAmount": amount,
                                "category": "Elected MP"
                            })
            except Exception as e:
                print(f"[DatasetLoader] Error parsing Lok Sabha CSV: {e}")

        return allocations

    @classmethod
    def get_summary_statistics(cls) -> dict:
        data = cls.load_mp_allocations()
        if not data:
            return {"totalMPs": 0, "totalAllocated": 0, "statesCount": 0}

        total_amount = sum(item["allocatedAmount"] for item in data)
        states = set(item["state"] for item in data if item["state"])

        return {
            "totalMPs": len(data),
            "totalAllocatedAmount": total_amount,
            "statesCount": len(states),
            "averageAllocationPerMP": round(total_amount / len(data), 2) if data else 0
        }
