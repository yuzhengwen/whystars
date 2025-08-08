import json
from azure.storage.blob import BlobServiceClient

class BlobHelper:
    data_container="whystars-data"

    def __init__(self, connect_str):
        self.blob_service_client = BlobServiceClient.from_connection_string(connect_str)

    def upload_json_data(self, data, blob_name):
        """Upload JSON data directly from memory without creating local files"""
        try:
            blob_client = self.blob_service_client.get_blob_client(container=self.data_container, blob=blob_name)
            print(f"Uploading JSON data to Azure Storage as blob: {blob_name}")
            
            # Convert data to JSON string and then to bytes
            json_string = json.dumps(data, indent=2)
            json_bytes = json_string.encode('utf-8')
            
            # Upload from memory
            blob_client.upload_blob(json_bytes, overwrite=True)
            print(f"Successfully uploaded {blob_name}")
        except Exception as ex:
            print(f'Exception uploading {blob_name}:')
            print(ex)

    def list_blobs(self, container_name):
        try:
            container_client = self.blob_service_client.get_container_client(container_name)
            print(f"Listing blobs in container: {container_name}")
            blob_list = container_client.list_blobs()
            for blob in blob_list:
                print("\t" + blob.name)
        except Exception as ex:
            print('Exception:')
            print(ex)