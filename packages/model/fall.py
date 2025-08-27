import cv2
import numpy as np
import torch
from torchvision import transforms
import math
from datetime import datetime
from yoloutils.datasets import letterbox
from yoloutils.general import non_max_suppression
from yoloutils.plots import output_to_target

# Use MPS for Apple Silicon if available, else CPU
device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
print(f"Using device: {device}")

class FallDetection:
    def __init__(self):
        self.transform = transforms.Compose([
            transforms.ToTensor(),
            transforms.ConvertImageDtype(torch.float16)
        ])
        self.scale_percent = 100  # set to 100 for full res
        self.stride = 64

        # Load the model
        self.model = torch.load("/Users/aloshdenny/vscode/metasave/packages/model/yolov7-w6-pose.pt", 
                                map_location=device, weights_only=False)
        self.model = self.model['model']
        self.model = self.model.half().to(device)
        _ = self.model.eval()

    def preprocess_frame(self, frame):
        height, width = frame.shape[:2]
        new_width = int(width * self.scale_percent / 100)
        new_height = int(height * self.scale_percent / 100)

        frame_resized = cv2.resize(frame, (new_width, new_height), interpolation=cv2.INTER_NEAREST)
        image_rgb = cv2.cvtColor(frame_resized, cv2.COLOR_BGR2RGB)
        image_lb = letterbox(image_rgb, (new_width), stride=self.stride, auto=True)[0]
        tensor = self.transform(image_lb).unsqueeze(0).to(device)
        return tensor, frame_resized

    def detect_fall(self, tensor):
        with torch.no_grad():
            output, _ = self.model(tensor)

        output = non_max_suppression(output, 0.25, 0.65, 
                                     nc=self.model.yaml['nc'], 
                                     nkpt=self.model.yaml['nkpt'], 
                                     kpt_label=True)
        output = output_to_target(output)

        if output.shape[0] == 0:
            return False

        for idx in range(output.shape[0]):
            try:
                # Keypoints
                left_shoulder_y = output[idx][23]
                left_shoulder_x = output[idx][22]
                left_body_y = output[idx][41]
                left_body_x = output[idx][40]
                left_foot_y = output[idx][53]

                # Approximate vertical body segment length
                len_factor = math.sqrt((left_shoulder_y - left_body_y)**2 +
                                       (left_shoulder_x - left_body_x)**2)

                # Fall detection heuristic
                if (left_shoulder_y > left_foot_y - len_factor and
                    left_body_y > left_foot_y - (len_factor / 2) and
                    left_shoulder_y > left_body_y - (len_factor / 2)):
                    return True
            except Exception as e:
                # Keypoint might be missing; skip this instance
                continue

        return False

    def run(self, video_path):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print("Error: Unable to open video")
            return

        frame_count = 0
        skip_frames = 2

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            frame_count += 1
            if frame_count % skip_frames != 0:
                continue

            tensor, display_frame = self.preprocess_frame(frame)
            fall_detected = self.detect_fall(tensor)

            if fall_detected:
                status = "FALL DETECTED!"
                color = (0, 0, 255)
            else:
                status = "No fall"
                color = (0, 255, 0)

            cv2.putText(display_frame, status, (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, color, 2, cv2.LINE_AA)
            cv2.imshow('Fall Detection', display_frame)

            if cv2.waitKey(1) & 0xFF == ord('q'):
                break

        cap.release()
        cv2.destroyAllWindows()

if __name__ == "__main__":
    detector = FallDetection()
    # Use 0 for webcam or provide full video path
    detector.run(0)