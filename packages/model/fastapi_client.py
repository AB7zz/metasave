import cv2
import numpy as np
import torch
from torchvision import transforms
from yoloutils.datasets import letterbox
import asyncio
import websockets
import json
import base64

class FallDetectionClient:
    def __init__(self, server_url='ws://43.133.109.85:6060/ws'):
        self.server_url = server_url
        
        # Pre-compute transform for better performance
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.ConvertImageDtype(torch.float16)  # Direct conversion to float16
        ])
        
        # Cache frequently used values
        self.scale_percent = 25
        self.stride = 64
        
    def preprocess_frame(self, frame):
        # Pre-calculate dimensions once
        height, width = frame.shape[:2]
        new_width = int(width * self.scale_percent / 100)
        new_height = int(height * self.scale_percent / 100)
        
        # Optimize resize operation
        frame = cv2.resize(frame, (new_width, new_height), 
                         interpolation=cv2.INTER_NEAREST)
        
        # Optimize color conversion
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Letterbox with pre-calculated dimensions
        image = letterbox(image, (new_width), stride=self.stride, auto=False)[0]
        
        # Optimize tensor conversion
        image = self.transform(image)  # This now includes float16 conversion
        
        # Add batch dimension efficiently
        image = image.unsqueeze(0)  # More efficient than creating numpy array
        
        return image, frame
    
    @torch.no_grad()  # Disable gradient computation
    def encode_tensor(self, tensor):
        return base64.b64encode(tensor.numpy().tobytes()).decode('utf-8')
    
    async def process_video(self, video_path):
        # Optimize video capture settings
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Error opening video file")
        
        # Optimize video capture buffer
        cap.set(cv2.CAP_PROP_BUFFERSIZE, 2)
        
        # Pre-calculate websocket connection parameters
        websocket_kwargs = {
            'max_size': None,
            'ping_interval': None,  # Disable ping-pong for better performance
            'compression': None  # Disable compression for lower latency
        }
        
        frame_count = 0
        skip_frames = 2  # Process every 3rd frame
        
        async with websockets.connect(self.server_url, **websocket_kwargs) as websocket:
            try:
                while cap.isOpened():
                    ret, frame = cap.read()
                    if not ret:
                        break
                    
                    frame_count += 1
                    if frame_count % skip_frames != 0:
                        continue
                    
                    # Preprocess frame
                    processed_frame, display_frame = self.preprocess_frame(frame)
                    
                    # Prepare frame data efficiently
                    frame_data = {
                        'frame': self.encode_tensor(processed_frame),
                        'height': int(processed_frame.shape[2]),
                        'width': int(processed_frame.shape[3])
                    }
                    
                    # Send frame data as pre-encoded JSON
                    await websocket.send(json.dumps(frame_data))
                    
                    # Get and parse prediction
                    result = json.loads(await websocket.recv())
                    
                    # Optimize display
                    if result['fallen']:
                        status = "FALL DETECTED!"
                        color = (0, 0, 255)
                    else:
                        status = "No fall"
                        color = (0, 255, 0)
                    
                    # Optimize text rendering
                    cv2.putText(display_frame, status, (10, 30),
                              cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2,
                              cv2.LINE_AA)
                    
                    cv2.imshow('Fall Detection', display_frame)
                    
                    if cv2.waitKey(1) & 0xFF == ord('q'):
                        break
                    
                    # Optimize delay
                    await asyncio.sleep(0.005)  # Reduced delay time
                    
            finally:
                cap.release()
                cv2.destroyAllWindows()

    def run(self, video_path):
        # Use optimized event loop policy if available
        try:
            # For Windows
            if hasattr(asyncio, 'WindowsSelectorEventLoopPolicy'):
                asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        except:
            pass
            
        asyncio.run(self.process_video(video_path))

if __name__ == "__main__":
    client = FallDetectionClient()
    client.run(r"D:\VSCODE\metasave\packages\model\fall.mp4")