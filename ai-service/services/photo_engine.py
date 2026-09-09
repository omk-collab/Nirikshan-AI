import math
import os
from PIL import Image
from PIL.ExifTags import TAGS, GPSTAGS

class PhotoEngine:
    @staticmethod
    def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """
        Haversine Distance Formula (Section 26 of implementation.md)
        Calculates distance in meters between project site and photo location.
        """
        R = 6371000.0  # Earth radius in meters
        phi1 = math.radians(lat1)
        phi2 = math.radians(lat2)
        delta_phi = math.radians(lat2 - lat1)
        delta_lambda = math.radians(lon2 - lon1)

        a = (math.sin(delta_phi / 2.0) ** 2 +
             math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0) ** 2)
        c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))

        return round(R * c, 2)

    @classmethod
    def extract_exif(cls, image_path: str) -> dict:
        """
        Extracts EXIF metadata including GPS coordinates and Timestamp (Section 27).
        """
        result = {
            "hasGps": False,
            "photoLat": None,
            "photoLng": None,
            "timestamp": None,
            "device": None,
            "statusMessage": "GPS metadata unavailable"
        }

        if not os.path.exists(image_path):
            return result

        try:
            image = Image.open(image_path)
            exif_raw = image.getexif() if hasattr(image, 'getexif') else (image._getexif() if hasattr(image, '_getexif') else None)
            if not exif_raw:
                return result

            exif_data = {}
            for tag, value in exif_raw.items():
                decoded = TAGS.get(tag, tag)
                exif_data[decoded] = value

            if "DateTimeOriginal" in exif_data:
                result["timestamp"] = str(exif_data["DateTimeOriginal"])

            if "Make" in exif_data or "Model" in exif_data:
                make = str(exif_data.get("Make", "")).strip()
                model = str(exif_data.get("Model", "")).strip()
                result["device"] = f"{make} {model}".strip()

            if "GPSInfo" in exif_data:
                gps_info = {}
                for key in exif_data["GPSInfo"].keys():
                    sub_tag = GPSTAGS.get(key, key)
                    gps_info[sub_tag] = exif_data["GPSInfo"][key]

                def convert_to_degrees(value):
                    d, m, s = value
                    return float(d) + (float(m) / 60.0) + (float(s) / 3600.0)

                if "GPSLatitude" in gps_info and "GPSLongitude" in gps_info:
                    lat = convert_to_degrees(gps_info["GPSLatitude"])
                    if gps_info.get("GPSLatitudeRef") == "S":
                        lat = -lat

                    lng = convert_to_degrees(gps_info["GPSLongitude"])
                    if gps_info.get("GPSLongitudeRef") == "W":
                        lng = -lng

                    result["hasGps"] = True
                    result["photoLat"] = round(lat, 6)
                    result["photoLng"] = round(lng, 6)
                    result["statusMessage"] = "GPS metadata extracted"

        except Exception as e:
            result["statusMessage"] = f"EXIF parsing error: {str(e)}"

        return result

    @classmethod
    def compute_phash(cls, image_path: str) -> str:
        """
        Computes perceptual hash (pHash) for image reuse detection (Section 28).
        """
        try:
            import imagehash
            image = Image.open(image_path)
            return str(imagehash.phash(image))
        except Exception:
            return ""

    @classmethod
    def verify_photo(cls, project_lat: float, project_lng: float, photo_path: str, max_allowed_meters: float = 500.0) -> dict:
        """
        Geotagged Photo Verification Workflow (Section 24-28 of implementation.md)
        """
        exif = cls.extract_exif(photo_path)
        phash = cls.compute_phash(photo_path)

        if not exif["hasGps"]:
            return {
                "photoVerificationStatus": "REQUIRES_REVIEW",
                "distanceMeters": None,
                "gpsStatus": "GPS metadata unavailable",
                "timestampStatus": "Metadata missing",
                "photoRisk": 65,
                "exif": exif,
                "phash": phash,
                "verificationResult": "FAIL",
                "message": "Photo lacks embedded EXIF GPS tags. Physical verification required."
            }

        dist = cls.haversine_distance(project_lat, project_lng, exif["photoLat"], exif["photoLng"])
        
        is_consistent = dist <= max_allowed_meters
        status = "PASS" if is_consistent else "FAIL"
        gps_status = "Consistent" if is_consistent else "Requires Review"
        photo_risk = 10 if is_consistent else min(100, int((dist / max_allowed_meters) * 45 + 50))

        return {
            "photoVerificationStatus": "VERIFIED" if is_consistent else "FLAGGED",
            "distanceMeters": dist,
            "gpsStatus": gps_status,
            "timestampStatus": "Verified" if exif["timestamp"] else "Missing",
            "photoRisk": photo_risk,
            "exif": exif,
            "phash": phash,
            "verificationResult": status,
            "message": f"Photo recorded {dist} meters from project location." if is_consistent else f"Photo location delta ({dist}m) exceeds threshold ({max_allowed_meters}m)."
        }
