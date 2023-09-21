import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart';

var IP_ADDRESS = ""; //"192.168.213.38";

Future<bool> getServerStatus(String ipAddress) async {
  debugPrint("Fetching Server Status request...");
  Response response = await get(Uri.parse("http://$ipAddress:5000/ping"));
  if(response.statusCode == 200) {
    IP_ADDRESS = ipAddress;
    return true;
  }
  return false;
}

Future<Map> getMachineStats() async {
  debugPrint("Fetching GET Machine Stats request...");
  Response response = await get(Uri.parse("http://$IP_ADDRESS:5000/pub_stats"));

  if (response.statusCode == 200) {
    Map<String, dynamic> machineStats = jsonDecode(response.body);
    debugPrint("Done fetching Machine Stats");
    return machineStats;
  } else {
    throw ErrorDescription("A network error has occurred!");
  }
}

Future<Map> getMachineResources() async {
  debugPrint("Fetching GET Machine Resources request...");
  Response response =
      await get(Uri.parse("http://$IP_ADDRESS:5000/pub_res_data"));

  if (response.statusCode == 200) {
    Map<String, dynamic> machineInfoData = jsonDecode(response.body);
    debugPrint("Done fetching Machine Resources Data");
    return machineInfoData;
  } else {
    throw ErrorDescription("A network error has occurred!");
  }
}

Future<Map> getBatchDataInfo() async {
  debugPrint("Fetching GET Batch Data request...");
  Response response =
      await get(Uri.parse("http://$IP_ADDRESS:5000/pub_batch_data"));
  Map<String, dynamic> batchData = {};
  if (response.statusCode == 200) {
    try {
      batchData = jsonDecode(response.body);
    } catch(e) {
      return batchData;
    }
    debugPrint("Done fetching Batch Data");
    return batchData;
  } else {
    throw ErrorDescription("A network error has occurred!");
  }
}

Future<List> getCarbonDataInfo() async {
  debugPrint("Fetching GET Carbon Data request...");
  Response response =
      await get(Uri.parse("http://$IP_ADDRESS:5000/pub_carbon_data"));

  if (response.statusCode == 200) {
    List carbonData = jsonDecode(response.body);
    debugPrint("TEST: ${carbonData}");
    debugPrint("Done fetching Carbon Data");
    return carbonData;
  } else {
    throw ErrorDescription("A network error has occurred!");
  }
}

