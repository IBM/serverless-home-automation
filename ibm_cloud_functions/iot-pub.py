import requests


def main(iot_obj):
    iot_org_id = iot_obj['iot_org_id']
    device_id = iot_obj['device_id']
    device_type = iot_obj['device_type']
    api_token = iot_obj['api_token']
    classes = [nlc_class for nlc_class in iot_obj['msg']['classes'] if nlc_class['confidence'] > 0.1]
    requests.post('http://' + iot_org_id + '.messaging.internetofthings.ibmcloud.com:1883/api/v0002/device/types/' + device_type + '/devices/' + device_id + '/events/query', headers={'Content-Type': 'application/json'}, json=classes, auth=('use-token-auth', api_token))
    return {'msg': iot_obj['msg']['text']}
