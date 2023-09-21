import 'dart:async';

import 'package:ecotracer/constants/colours.dart';
import 'package:ecotracer/ecotrace_setup.dart';
import 'package:ecotracer/models/requests.dart';
import 'package:flutter/material.dart';
import 'package:lottie/lottie.dart';

class ConnectingPage extends StatefulWidget {
  void Function(String ipAddress) getServerStatusCallback;
  ConnectingPage(this.getServerStatusCallback, {super.key});

  @override
  State<ConnectingPage> createState() => _ConnectingState();
}

class _ConnectingState extends State<ConnectingPage> with SingleTickerProviderStateMixin {
  late final AnimationController animController;
  var textfieldController;
  bool isConnected = false;

  @override
  void initState() {
    super.initState();
    textfieldController = TextEditingController();
    animController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2)
    )..addListener(() {
      if(animController.isCompleted) {
        animController.repeat();
      }
    });
  }

  @override
  void dispose() {
    animController.dispose();
    super.dispose();
    textfieldController.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            padding:
                const EdgeInsets.only(top: 45, bottom: 10, left: 0, right: 25),
            alignment: Alignment.center,
            width: double.infinity,
            height: 140,
            decoration: const BoxDecoration(color: AppColor.emerald),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset('assets/logo.webp'),
                const Text(
                  "EcoTracer",
                  style: TextStyle(
                      fontSize: 29,
                      fontWeight: FontWeight.w500,
                      color: AppColor.dark),
                ),
        ])),
          Expanded(
            child: SingleChildScrollView(
              child: Container(
                margin: const EdgeInsets.only(bottom: 25),
                child: Center(
                child: Column(
                  children: [
                      Lottie.asset('assets/connecting.json',
                      controller: animController),
                      Container(
                        margin: const EdgeInsets.only(left: 40, right: 40, bottom: 20),
                        child: TextField(
                          controller: textfieldController,
                          decoration: const InputDecoration(
                          border: OutlineInputBorder(borderSide: BorderSide(color: AppColor.darkTeal)),
                          labelText: 'IP Address',
                                )),
                      ),
                  Container(
                    margin: const EdgeInsets.symmetric(horizontal: 100),
                    height: 40,
                  child: ButtonWidget(label: "Connect", callback: () {
                    widget.getServerStatusCallback.call(textfieldController.text);
                    animController.forward();
                  }))
                  ],
                )
                          ),
              ),
                ),
          )],
      ),
    );
  }
}