import 'dart:async';

import 'package:ecotracer/constants/colours.dart';
import 'package:ecotracer/ecotrace_monitor_info.dart';
import 'package:ecotracer/models/requests.dart';
import 'package:ecotracer/models/setup_model.dart';
import 'package:flutter/material.dart';

class EcoTracerSetupPage extends StatelessWidget {
  double topBarHeight = 140.0;

  EcoTracerSetupPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: AppColor.emerald,
        body: Column(children: [
          Container(
            padding:
                const EdgeInsets.only(top: 45, bottom: 10, left: 25, right: 25),
            alignment: Alignment.centerLeft,
            width: double.infinity,
            height: topBarHeight,
            decoration: const BoxDecoration(color: AppColor.emerald),
            child: const Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Set Up",
                  style: TextStyle(
                      fontSize: 29,
                      fontWeight: FontWeight.w500,
                      color: AppColor.dark),
                ),
                SizedBox(height: 3),
                Text(
                  "View Batch and Drinks Info",
                  style: TextStyle(fontSize: 20, color: AppColor.dark),
                )
              ],
            ),
          ),
          Expanded(
              child: ClipRRect(
                  borderRadius: const BorderRadius.only(
                      topLeft: Radius.circular(25),
                      topRight: Radius.circular(25)),
                  child: Container(
                    child: SingleChildScrollView(
                        child: Container(
                      padding: const EdgeInsets.only(top: 20, bottom: 5),
                      decoration:
                          const BoxDecoration(color: AppColor.background),
                      child: EcoTracerSetupWidget(),
                    )),
                  )))
        ]));
  }
}

class EcoTracerSetupWidget extends StatefulWidget {
  const EcoTracerSetupWidget({super.key});

  @override
  State<EcoTracerSetupWidget> createState() => _EcoTracerSetupState();
}

class _EcoTracerSetupState extends State<EcoTracerSetupWidget> {
  late Timer requestTimer;
  Map batchData = {};

  @override
  void initState() {
    super.initState();
    startFetching();
    requestTimer = Timer.periodic(const Duration(seconds: 2), (timer) async {
      startFetching();
    });
  }

  void startFetching() async {
    batchData = await getBatchDataInfo();
    
    debugPrint(batchData.toString());
    if(batchData.isEmpty) {
      return;
    }
    
    setState(() {
      
    });
  }

  @override
  void dispose() {
    super.dispose();
    requestTimer.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
              margin: const EdgeInsets.only(bottom: 15, left: 20, right: 20),
              alignment: Alignment.centerLeft,
              child: const Text(
                "Current Batch",
                style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: AppColor.brown,
                    fontSize: 20),
              )),
          (batchData.isEmpty) ? Container(
            margin: const EdgeInsets.symmetric(vertical: 20),
            child: Row( 
              mainAxisAlignment: MainAxisAlignment.center,
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                alignment: Alignment.center,
                child: const Text(
                  "No Batch Has Been Started!",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                      fontWeight: FontWeight.w500,
                      color: AppColor.dark,
                      fontSize: 18),
                ))]),
          ) 
              : CurrentBatchWidget(batchData: batchData),
          Container(
              margin: const EdgeInsets.only(
                  top: 25, bottom: 15, left: 20, right: 20),
              alignment: Alignment.centerLeft,
              child: const Text(
                "Next Batch Queue",
                style: TextStyle(
                    fontWeight: FontWeight.w700,
                    color: AppColor.brown,
                    fontSize: 20),
              )),
          Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              height: 25,
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Expanded(flex: 1, child: ButtonWidget(label: "Add Batch")),
                  const SizedBox(width: 15),
                  Expanded(flex: 1, child: ButtonWidget(label: "Remove Batch"))
                ],
              )),
          // TEMPORARY EXPANDING OF WIDGET (PLEASE CHANGE)
          Container(height: 400, decoration: const BoxDecoration(color: AppColor.background))
        ]);
  }
}

class ButtonWidget extends StatelessWidget {
  String? label;

  ButtonWidget({required this.label, super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        // TO IMPLEMENT LISTENER LAMBDA
        onTap: () => debugPrint("User pressed ${label} button"),
        child: Container(
            decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(20), color: AppColor.btnBg),
            alignment: Alignment.center,
            child: Text(
              label!,
              textAlign: TextAlign.center,
              style: const TextStyle(
                  color: AppColor.offWhite,
                  fontSize: 15,
                  fontWeight: FontWeight.w700),
            )));
  }
}

// ignore: must_be_immutable
class CurrentBatchWidget extends StatelessWidget {
  Map batchData;

  CurrentBatchWidget({super.key, required this.batchData});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120,
      margin: const EdgeInsets.symmetric(horizontal: 20),
      decoration: const BoxDecoration(
          color: AppColor.darkTeal,
          borderRadius: BorderRadius.all(Radius.circular(25))),
      child: Column(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 20),
              child: Text(
                "Batch ${SetupModel().getCurrentItemCount(batchData: batchData)}/${SetupModel().getMaxItemCount(batchData: batchData)}",
                style: const TextStyle(color: AppColor.offWhite, fontSize: 15),
              ),
            ),
            const SizedBox(height: 10),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 10),
              child: InfoProgressBar(
                title: SetupModel().getDrinkName(batchData: batchData)!,
                progress: SetupModel().getPercentage(batchData: batchData)!,
                fillColour: const Color(0xFFD6DEDB),
                backgroundColour: const Color(0xFF73A79E),
                textColour: AppColor.offWhite,
                textSize: 20,
              ),
            )
          ]),
    );
  }
}
