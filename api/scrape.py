from python.scraping import try_fetch_new_sem
from python.parser import parse_data
from python.blob_helper import BlobHelper
from dotenv import load_dotenv
import os
import json
from http.server import BaseHTTPRequestHandler
from datetime import datetime

load_dotenv()
connect_str = os.getenv('CONNECTION_STR')
blob_helper = BlobHelper(connect_str)

academic_year = "2025"
semester = "1"

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Perform scraping and parsing in memory
            html_data = try_fetch_new_sem(blob_helper)
            
            if html_data is None:
                raise Exception("Failed to fetch data")
            
            # Parse the HTML data in memory
            parsed_data = parse_data(html_data)
            
            # Upload parsed data directly to blob storage
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            folder_name = f"data/{academic_year}_{semester}"
            
            # Upload all the parsed data files
            blob_helper.upload_json_data(parsed_data["module_full_data"], f"{folder_name}/module_full_data.json")
            blob_helper.upload_json_data(parsed_data["module_list"], f"{folder_name}/module_list.json")
            
            # Upload individual module files
            for mod_code, mod_data in parsed_data["individual_mods"].items():
                blob_helper.upload_json_data(mod_data, f"{folder_name}/mods/{mod_code}.json")
            
            # Send success response
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            response = {
                "message": "Scraping and parsing completed successfully",
                "timestamp": datetime.now().isoformat(),
                "academic_year": academic_year,
                "semester": semester,
                "modules_count": len(parsed_data["module_full_data"])
            }
            
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            # Send error response
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            error_response = {
                "error": str(e),
                "message": "Scraping failed",
                "timestamp": datetime.now().isoformat()
            }
            
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
    
    def do_POST(self):
        # Handle POST requests the same way (for cron jobs)
        self.do_GET()