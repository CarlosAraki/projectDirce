import tinytuya

# Connect to Device
d = tinytuya.OutletDevice(
    dev_id='******',
    address='Auto',      # Or set to 'Auto' to auto-discover IP address
    version=3.3)

# Get Status
data = d.status() 
print('set_status() result %r' % data)
print('set_status() result %r' % d)
data = d.set_status("disarmed", 1)
data = d.status() 

print('set_status() result %r' % data)


