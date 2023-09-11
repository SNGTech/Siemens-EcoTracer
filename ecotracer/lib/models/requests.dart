import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart';

const IP_ADDRESS = "10.0.2.2";

Future<List> getMachineStats() async {
    debugPrint("Fetching GET Machine Stats request...");
    Response response = await get(Uri.parse("http://$IP_ADDRESS:5000/pub_data"));

    if(response.statusCode == 200) {
      List<dynamic> machineStats = jsonDecode(response.body);
      debugPrint("Done fetching Machine Stats");
      return machineStats;
    } else {
      throw ErrorDescription("A network error has occurred!");
    }
  }

Future<List> getMachineInfo() async {
    debugPrint("Fetching GET Machine Info request...");
    Response response = await get(Uri.parse("http://$IP_ADDRESS:5000/pub_info_data"));

    if(response.statusCode == 200) {
      List<dynamic> machineInfoData = jsonDecode(response.body);
      debugPrint("Done fetching Machine Info Data");
      return machineInfoData;
    } else {
      throw ErrorDescription("A network error has occurred!");
    }
  }

Future<List> getBatchDataInfo() async {
    debugPrint("Fetching GET Batch Data request...");
    Response response = await get(Uri.parse("http://$IP_ADDRESS:5000/pub_batch_data"));

    if(response.statusCode == 200) {
      List<dynamic> batchData = jsonDecode(response.body);
      debugPrint("Done fetching Batch Data");
      return batchData;
    } else {
      throw ErrorDescription("A network error has occurred!");
    }
  }  