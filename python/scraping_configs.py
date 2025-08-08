import json
import os
from datetime import datetime

user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"

class semester:
    def __init__(self, year, semester):
        self.year = year
        self.semester = semester

    def __str__(self):
        return f"{self.year} Semester {self.semester}"

    def __repr__(self):
        return str(self)
    
    def get_blob_folder(self):
        return f"{self.year}S{self.semester}"
    
    def next(self):
        if self.semester == 2:
            return semester(self.year + 1, 1)
        else:
            return semester(self.year, 2)
    
    def set_next(self):
        next_sem = self.next()
        self.year = next_sem.year
        self.semester = next_sem.semester

EXAM_KEY = "latest_exam_sem"
MODS_KEY = "latest_mod_sem"

def get_fallback_semester():
    """Get fallback semester based on current date"""
    current_year = datetime.now().year
    current_month = datetime.now().month
    
    # Academic calendar for 2025: Semester 1 = July-December, Semester 2 = January-June
    if current_year == 2025:
        if 7 <= current_month <= 12:  # July-December = Semester 1
            semester_num = 1
        else:  # January-June = Semester 2
            semester_num = 2
    else:
        # Default calendar assumption for other years: Semester 1 = Jan-June, Semester 2 = July-Dec
        if current_month <= 6:
            semester_num = 1
        else:
            semester_num = 2
    
    print(f"Using fallback semester: {current_year} semester {semester_num}")
    return semester(current_year, semester_num)

def get_latest_semester(key, blob_helper):
    """Get latest semester from latest.json in Azure Blob Storage using BlobHelper"""
    try:
        # Download the latest.json file from blob storage using BlobHelper
        print(f"Downloading latest.json from Azure Blob Storage...")
        blob_data = blob_helper.download_json_data("latest.json")
        
        if not blob_data or key not in blob_data:
            print(f"Key '{key}' not found in latest.json, using fallback")
            return get_fallback_semester()
        
        year = blob_data[key]["year"]
        semester_num = blob_data[key]["semester"]
        print(f"Retrieved {key}: {year} semester {semester_num}")
        
        return semester(year, semester_num)
        
    except Exception as e:
        print(f"Could not read latest.json from blob storage: {e}")
        print("Using fallback semester...")
        return get_fallback_semester()

def progress_semester(key, blob_helper):
    """Progress to next semester and save to latest.json in Azure Blob Storage using BlobHelper"""
    try:
        # Download current latest.json using BlobHelper
        try:
            print("Downloading current latest.json...")
            data = blob_helper.download_json_data("latest.json")
            if not data:
                data = {}
        except Exception as e:
            print(f"Could not download existing latest.json: {e}")
            print("Creating new latest.json...")
            data = {}
        
        # Get current semester and progress to next
        if key in data:
            current_sem = semester(data[key]["year"], data[key]["semester"])
        else:
            current_sem = get_fallback_semester()
        
        # Progress to next semester
        next_sem = current_sem.next()
        
        # Update data
        data[key] = {
            "year": next_sem.year,
            "semester": next_sem.semester,
            "updated_at": datetime.now().isoformat(),
            "updated_by": "scraping_function"
        }
        
        # Upload updated latest.json back to blob storage using BlobHelper
        blob_helper.upload_json_data(data, "latest.json")
        
        print(f"Progressed {key} from {current_sem} to {next_sem}")
        print("Updated latest.json in Azure Blob Storage")
        
    except Exception as e:
        print(f"Could not update latest.json in blob storage: {e}")
        print("State will not be persisted")

