import requests
from python.scraping_configs import user_agent, MODS_KEY, get_latest_semester, progress_semester

url = "https://wish.wis.ntu.edu.sg/webexe/owa/AUS_SCHEDULE.main_display1"

def fetch_data(academic_year="2025", semester="1"):
    """Fetch data and return HTML content in memory without saving to disk"""
    values = {
            'r_search_type': 'F',
            'boption': 'Search',
            'acadsem': f"{academic_year};{semester}",
            'r_subj_code': '',
            'staff_access': 'false',
        }
    headers = {
        'User-Agent': user_agent,
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    print(f"Fetching data for {academic_year} semester {semester}")
    response = requests.post(url, data=values, headers=headers)
    print("Response code:", response.status_code)

    if response.status_code != 200:
        print("Failed to fetch data")
        return None
    if response.text.find("Class schedule is not available") != -1:
        print("No new data available")
        return None
    
    print("Data fetched successfully")
    return response.text

def try_fetch_new_sem(blob_helper):
    """Try to fetch new semester data, fallback to latest if not available"""
    latest_sem = get_latest_semester(MODS_KEY, blob_helper)
    next_sem = latest_sem.next()
    print(f"Trying to fetch mods data for {next_sem}...")
    mod_data_html = fetch_data(next_sem.year, next_sem.semester)
    if mod_data_html is None:
        print(f"Failed to fetch mods data for {next_sem}, no new data available\n")
        print(f"Refetching data for {latest_sem}...")
        mod_data_html = fetch_data(latest_sem.year, latest_sem.semester)
    else:
        print(f"Success! Fetched mods data for {next_sem}")
        progress_semester(MODS_KEY, blob_helper)
        print(f"Progressed to {next_sem}\n")
    return mod_data_html