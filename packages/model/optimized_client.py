import grpc
import cv2
import numpy as np
import torch
from torchvision import transforms
from yoloutils.datasets import letterbox
import fall_detection_pb2
import fall_detection_pb2_grpc

class FallDetectionClient:
    def __init__(self, host='43.133.109.85', port=5000):
        options = [
            ('grpc.max_send_message_length', 50 * 1024 * 1024),  # 50MB
            ('grpc.max_receive_message_length', 50 * 1024 * 1024)  # 50MB
        ]
        self.channel = grpc.insecure_channel(f'{host}:{port}', options=options)
        self.stub = fall_detection_pb2_grpc.FallDetectionServiceStub(self.channel)
        
        # Initialize preprocessing transforms
        self.transform = transforms.ToTensor()

    def preprocess_frame(self, frame):
        # Convert BGR to RGB
        image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # Letterbox resize
        image = letterbox(image, (frame.shape[1]), stride=64, auto=True)[0]
        
        # Convert to tensor and normalize
        image = self.transform(image)
        
        # Add batch dimension and convert to float16
        image = torch.tensor(np.array([image.numpy()]))
        image = image.half()
        
        return image

    def process_video(self, video_path):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError("Error opening video file")
            
        try:
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Preprocess frame locally
                processed_frame = self.preprocess_frame(frame)
                
                # Prepare request
                request = fall_detection_pb2.FallRequest(
                    frame_data=processed_frame.numpy().tobytes(),
                    height=processed_frame.shape[2],
                    width=processed_frame.shape[3]
                )
                
                # Get prediction
                response = self.stub.DetectFall(request)
                
                # Display result
                status = "FALL DETECTED!" if response.fallen else "No fall"
                # color = (0, 0, 255) if response.fallen else (0, 255, 0)
                
                # cv2.putText(frame, status, (10, 30),
                        #    cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2)
                # cv2.imshow('Fall Detection', frame)
                
                # if cv2.waitKey(1) & 0xFF == ord('q'):
                    # break
                print(status)
                    
        finally:
            cap.release()
            cv2.destroyAllWindows()
            self.channel.close()

if __name__ == "__main__":
    client = FallDetectionClient()
    client.process_video(r"D:\metasave\packages\model\fall.mp4")