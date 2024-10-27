import cv2
import requests
import base64
import numpy as np
from io import BytesIO

class FallDetectionClient:
    def __init__(self, server_url='http://43.133.109.85:5000'):
        self.server_url = server_url
        self.session = requests.Session()  # Reuse connection for better performance
        
    def preprocess_frame(self, frame):
        # Pre-calculate dimensions (25% of original size)
        height, width = frame.shape[:2]
        new_width = width // 4
        new_height = height // 4
        
        # Use faster resize method with pre-calculated dimensions
        resized_frame = cv2.resize(frame, (new_width, new_height), 
                                 interpolation=cv2.INTER_NEAREST)
        
        # Optimize JPEG encoding with lower quality
        encode_params = [int(cv2.IMWRITE_JPEG_QUALITY), 70]
        _, buffer = cv2.imencode('.jpg', resized_frame, encode_params)
        encoded_frame = base64.b64encode(buffer).decode('utf-8')
        return f'data:image/jpeg;base64,{encoded_frame}', frame

    def send_frame(self, encoded_frame):
        try:
            response = self.session.post(
                f'{self.server_url}/detect_fall',
                json={'frame': encoded_frame},
                timeout=5
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'fallen': False, 'error': str(e)}
    
    def process_video(self, video_path):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Error opening video file")
        
        # Optimize video capture buffer
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)
        
        frame_count = 0
        skip_frames = 3  # Process every 4th frame
        
        try:
            while cap.isOpened():
                ret, frame = cap.read()
                if not ret:
                    break
                
                frame_count += 1
                if frame_count % skip_frames != 0:
                    continue
                
                # Preprocess frame with optimized settings
                encoded_frame, display_frame = self.preprocess_frame(frame)
                
                # Send frame and get result
                result = self.send_frame(encoded_frame)
                
                # Prepare display info
                status = "FALL DETECTED!" if result.get('fallen') else "No fall"
                color = (0, 0, 255) if result.get('fallen') else (0, 255, 0)
                
                # Optimize text rendering
                cv2.putText(display_frame, status, (10, 30),
                           cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2,
                           cv2.LINE_AA)
                
                cv2.imshow('Fall Detection', display_frame)
                
                # Break loop if 'q' is pressed
                if cv2.waitKey(1) & 0xFF == ord('q'):
                    break
                
        finally:
            cap.release()
            cv2.destroyAllWindows()
            self.session.close()

if __name__ == "__main__":
    client = FallDetectionClient()
    client.process_video(r"D:\metasave\packages\model\fall.mp4")