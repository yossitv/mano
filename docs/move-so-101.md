# Moving SO-101 from PC (Direct Serial Control)

On macOS, the Cyberwave Docker driver cannot access USB devices. Instead, control the Feetech STS3215 servos directly via the serial port using `feetech-servo-sdk`.

## Prerequisites

- SO-101 robot arm connected via USB
- 12V external power supply connected to the driver board
- Python 3.11+

## 1. Install Dependencies

```bash
pip install feetech-servo-sdk
```

## 2. Find Your Serial Port

```bash
ls /dev/tty.usbmodem*
```

Example output: `/dev/tty.usbmodem5AE60824111`

## 3. Scan for Motors

```python
from scservo_sdk import *

PORT = "/dev/tty.usbmodem5AE60824111"  # Replace with your port
BAUDRATE = 1000000

port_handler = PortHandler(PORT)
packet_handler = PacketHandler(0)
port_handler.openPort()
port_handler.setBaudRate(BAUDRATE)

for motor_id in range(1, 7):
    model, result, error = packet_handler.ping(port_handler, motor_id)
    if result == COMM_SUCCESS:
        print(f"Motor {motor_id}: found (model: {model})")

port_handler.closePort()
```

## 4. Move a Single Joint

```python
from scservo_sdk import *
import time

PORT = "/dev/tty.usbmodem5AE60824111"
BAUDRATE = 1000000
ADDR_PRESENT_POSITION = 56
ADDR_GOAL_POSITION = 42
ADDR_TORQUE_ENABLE = 40

port_handler = PortHandler(PORT)
packet_handler = PacketHandler(0)
port_handler.openPort()
port_handler.setBaudRate(BAUDRATE)

motor_id = 1  # 1-6

# Enable torque
packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 1)

# Read current position
pos, _, _ = packet_handler.read2ByteTxRx(port_handler, motor_id, ADDR_PRESENT_POSITION)
print(f"Current position: {pos}")

# Move by offset
target = pos + 500
packet_handler.write2ByteTxRx(port_handler, motor_id, ADDR_GOAL_POSITION, target)
time.sleep(2)

# Disable torque
packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 0)

port_handler.closePort()
```

## 5. Move All Joints

```python
from scservo_sdk import *
import time

PORT = "/dev/tty.usbmodem5AE60824111"
BAUDRATE = 1000000
ADDR_PRESENT_POSITION = 56
ADDR_GOAL_POSITION = 42
ADDR_TORQUE_ENABLE = 40

port_handler = PortHandler(PORT)
packet_handler = PacketHandler(0)
port_handler.openPort()
port_handler.setBaudRate(BAUDRATE)

# Enable torque on all motors
for motor_id in range(1, 7):
    packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 1)

# Read current positions
positions = {}
for motor_id in range(1, 7):
    pos, _, _ = packet_handler.read2ByteTxRx(port_handler, motor_id, ADDR_PRESENT_POSITION)
    positions[motor_id] = pos
    print(f"Motor {motor_id}: {pos}")

# Move each joint by offset
offsets = {1: 300, 2: 200, 3: -200, 4: 150, 5: -100, 6: 200}

for motor_id, offset in offsets.items():
    target = positions[motor_id] + offset
    print(f"Moving motor {motor_id} to {target} ({'+' if offset > 0 else ''}{offset})")
    packet_handler.write2ByteTxRx(port_handler, motor_id, ADDR_GOAL_POSITION, target)
    time.sleep(1)

# Return to original positions
print("\nReturning to original positions...")
for motor_id, pos in positions.items():
    packet_handler.write2ByteTxRx(port_handler, motor_id, ADDR_GOAL_POSITION, pos)
time.sleep(2)

# Disable torque
for motor_id in range(1, 7):
    packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 0)

port_handler.closePort()
print("Done!")
```

## Motor Map

| Motor ID | Joint          |
|----------|----------------|
| 1        | Base rotation  |
| 2        | Shoulder       |
| 3        | Elbow          |
| 4        | Wrist pitch    |
| 5        | Wrist roll     |
| 6        | Gripper        |

## Key Registers

| Register | Address | Size    | Description      |
|----------|---------|---------|------------------|
| Torque   | 40      | 1 byte  | 1=enable, 0=off  |
| Goal Pos | 42      | 2 bytes | Target position   |
| Cur Pos  | 56      | 2 bytes | Current position  |

## Notes

- Always enable torque before sending goal positions
- Always disable torque when done to allow manual movement
- Position values range from 0 to 4095 (12-bit)
- Move in small increments first to avoid collisions
- The 12V power supply must be connected for the servos to physically move
