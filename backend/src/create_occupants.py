'''Create mock parking records'''
import random
import datetime
import requests

slots = list(range(1, 223))
start_date = datetime.datetime.strptime('2023-12-04', '%Y-%m-%d')
end_date = datetime.datetime.strptime('2023-12-05', '%Y-%m-%d')

user_licenses = ['ABC-5678', 'DEF-1234', 'GHI-7890', 'JKL-4567', 'MNO-8901',
                 'PQR-2345', 'STU-6789', 'VWX-3456', 'YZA-9012', 'BCD-7890',
                 'EFG-1234', 'HIJ-5678', 'KLM-2345', 'NOP-6789', 'QRS-3456',
                 'TUV-9012', 'WXY-4567', 'ZAB-8901', 'CDE-1234', 'FGH-5678']
user_slots = [1, 2, 3, 204, 205,
              102, 103, 206, 207, 104,
              208, 209, 210, 4, 105,
              5, 211, 212, 213, 106, 6]

t = datetime.datetime.now()
for i in range(20):
    license_plate_no = user_licenses[i]
    slot = user_slots[i]
    duration = random.randint(60*30, 60*480)
    start_time = t - datetime.timedelta(seconds=duration)
    requests.post(f'http://127.0.0.1:8000/api/parking/{slot}',
                    json={"license_plate_no": license_plate_no, "start_time": str(start_time)},
                    timeout=5)
    print(f'{license_plate_no} still in slot {slot}, start time: {start_time}')
