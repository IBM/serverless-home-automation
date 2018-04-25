import requests
def main(iot_obj):
    # import IOT platform credentials
    iot_org_id = iot_obj['iot_org_id']
    device_id = iot_obj['device_id']
    device_type = iot_obj['device_type']
    api_token = iot_obj['api_token']
    # extract result from configuration service
    payload = {"d": iot_obj['msg']}
    # publish conversation intent/entity pair to Watson IOT platform and subsequently all subscribed devices
    requests.post('https://' + iot_org_id + '.messaging.internetofthings.ibmcloud.com:8883/api/v0002/device/types/' + device_type + '/devices/' + device_id + '/events/query', headers={'Content-Type': 'application/json'}, json=payload, auth=('use-token-auth', api_token))
    return {"msg": payload}
