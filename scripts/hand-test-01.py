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
    print("Motor %d: %d" % (motor_id, pos))

# Move each joint
offsets = {1: 500, 2: 300, 3: -300, 4: 200, 5: -150, 6: 300}
print()
for motor_id, offset in offsets.items():
    target = positions[motor_id] + offset
    sign = "+" if offset > 0 else ""
    print("Moving motor %d to %d (%s%d)" % (motor_id, target, sign, offset))
    packet_handler.write2ByteTxRx(port_handler, motor_id, ADDR_GOAL_POSITION, target)
    time.sleep(1.5)

# Return to original positions
print()
print("Returning to original positions...")
for motor_id, pos in positions.items():
    packet_handler.write2ByteTxRx(port_handler, motor_id, ADDR_GOAL_POSITION, pos)
time.sleep(2)

# Disable torque
for motor_id in range(1, 7):
    packet_handler.write1ByteTxRx(port_handler, motor_id, ADDR_TORQUE_ENABLE, 0)

port_handler.closePort()
print("Done!")
