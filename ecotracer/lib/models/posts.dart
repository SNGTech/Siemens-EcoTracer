import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart';

const IP_ADDRESS = "192.168.213.38";

void postStartBatch() async {
  debugPrint("Posting Start Batch request...");
  try {
    Response response = await post(Uri.parse("http://$IP_ADDRESS:5000/post_start_batch"),
    headers: <String, String>{
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: jsonEncode({
      "drink_name": "Black Tea",
      "max_item_count": 5    
    }));
    debugPrint("Response Body: ${response.body}");
  // ignore: empty_catches
  } catch(e) {
    debugPrint("${e}");
  }
}