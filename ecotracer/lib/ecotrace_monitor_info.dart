import 'package:ecotracer/constants/colours.dart';
import 'package:ecotracer/models/monitor_info_model.dart';
import 'package:flutter/material.dart';
import "package:intl/intl.dart";
import 'package:percent_indicator/circular_percent_indicator.dart';
import 'package:percent_indicator/linear_percent_indicator.dart';
import 'package:ecotracer/models/requests.dart';
import 'dart:async';

class EcoTracerMachineInfoWidget extends StatefulWidget {
  const EcoTracerMachineInfoWidget({super.key});

  @override
  State<EcoTracerMachineInfoWidget> createState() =>
      _EcoTracerMachineInfoState();
}

class _EcoTracerMachineInfoState extends State<EcoTracerMachineInfoWidget> {
  late Timer requestTimer;
  late List machineStats;
  Map? machineInfoData;

  @override
  void initState() {
    super.initState();
    requestTimer = Timer.periodic(const Duration(seconds: 1), (timer) async {
      machineStats = await getMachineStats();
      List infoDataList = await getMachineInfo();
      machineInfoData = infoDataList[infoDataList.length - 1];
      debugPrint(machineInfoData.toString());

      setState(() {
        machineInfoData = infoDataList[infoDataList.length - 1];
      });
    });
  }

  @override
  void dispose() {
    super.dispose();
    requestTimer.cancel();
  }

  @override
  Widget build(BuildContext context) {
    return (machineInfoData == null)
        ? Container(
            padding: const EdgeInsets.only(bottom: 200),
            height: MediaQuery.of(context).size.height - 140,
            child: const Center(
              child: CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(AppColor.darkTeal),
                strokeCap: StrokeCap.round,
                strokeWidth: 5,
              ),
            ),
          )
        : Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            mainAxisSize: MainAxisSize.min,
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
                Container(
                    margin:
                        const EdgeInsets.only(bottom: 15, left: 20, right: 20),
                    alignment: Alignment.centerLeft,
                    child: const Text(
                      "Overall Equipment Effectiveness",
                      style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColor.brown,
                          fontSize: 20),
                    )),
                const OEEScoreWidget(),
                const SizedBox(height: 15),
                Container(
                  margin: const EdgeInsets.symmetric(horizontal: 15),
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      ProgressChart(
                          title: "Availability",
                          progress: 0.25,
                          fillColour: AppColor.statsRed),
                      ProgressChart(
                          title: "Performance",
                          progress: 0.76,
                          fillColour: AppColor.statsBlue),
                      ProgressChart(
                          title: "Quality",
                          progress: 0.39,
                          fillColour: AppColor.statsPurple)
                    ],
                  ),
                ),
                Container(
                    margin: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 15),
                    alignment: Alignment.centerLeft,
                    child: const Text(
                      "Resources",
                      style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColor.brown,
                          fontSize: 20),
                    )),
                Container(
                    margin: const EdgeInsets.symmetric(horizontal: 10),
                    child: Column(children: [
                      InfoProgressBar(
                          title: "Milk",
                          progress: 0.25,
                          fillColour: Colors.white),
                      InfoProgressBar(
                          title: "Tea",
                          progress: 0.48,
                          fillColour: AppColor.darkTeal),
                      InfoProgressBar(
                          title: "Water",
                          progress: MonitorInfoModel().getWaterVolumePercentage(
                              infoData: machineInfoData!)!,
                          fillColour: AppColor.statsBlue),
                      InfoProgressBar(
                          title: "Bottle",
                          progress: 0.08,
                          fillColour: AppColor.statsPurple),
                    ])),
                Container(
                    margin: const EdgeInsets.symmetric(
                        horizontal: 20, vertical: 15),
                    alignment: Alignment.centerLeft,
                    child: const Text(
                      "Machine Integrity",
                      style: TextStyle(
                          fontWeight: FontWeight.w700,
                          color: AppColor.brown,
                          fontSize: 20),
                    )),
                Container(
                    margin: const EdgeInsets.symmetric(horizontal: 10),
                    child: const Column(children: [
                      InfoProgressBar(
                          title: "Pipes",
                          progress: 0.45,
                          fillColour: AppColor.statsRed),
                      InfoProgressBar(
                          title: "Valves",
                          progress: 0.68,
                          fillColour: AppColor.statsYellow)
                    ]))
              ]);
  }
}

class OEEScoreWidget extends StatelessWidget {
  const OEEScoreWidget({
    super.key,
  });

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
                "As of ${DateFormat("yMMMd").format(DateTime.now())}",
                style: const TextStyle(color: AppColor.offWhite, fontSize: 15),
              ),
            ),
            const SizedBox(height: 10),
            Container(
              margin: const EdgeInsets.symmetric(horizontal: 10),
              child: const InfoProgressBar(
                title: "Total Score",
                progress: 0.67,
                fillColour: Color(0xFFD6DEDB),
                backgroundColour: Color(0xFF73A79E),
                textColour: AppColor.offWhite,
                textSize: 20,
              ),
            )
          ]),
    );
  }
}

class InfoProgressBar extends StatelessWidget {
  final String title;
  final double progress;
  final Color fillColour;
  final Color backgroundColour;
  final Color textColour;
  final double textSize;

  const InfoProgressBar(
      {required this.title,
      required this.progress,
      required this.fillColour,
      this.backgroundColour = AppColor.percentBackground,
      this.textColour = AppColor.dark,
      this.textSize = 18,
      super.key});

  @override
  Widget build(BuildContext context) {
    return Column(mainAxisSize: MainAxisSize.min, children: [
      Container(
        margin: const EdgeInsets.symmetric(horizontal: 10),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          mainAxisSize: MainAxisSize.min,
          children: [
            Expanded(
              flex: 1,
              child: Text(
                title,
                textAlign: TextAlign.left,
                style: TextStyle(
                    color: textColour,
                    fontSize: textSize,
                    fontWeight: FontWeight.w700),
              ),
            ),
            Expanded(
              flex: 1,
              child: Text(
                "${(progress * 100).toInt()}%",
                textAlign: TextAlign.right,
                style: TextStyle(
                    color: textColour,
                    fontSize: textSize,
                    fontWeight: FontWeight.w700),
              ),
            )
          ],
        ),
      ),
      const SizedBox(height: 10),
      LinearPercentIndicator(
        lineHeight: 10,
        percent: progress,
        progressColor: fillColour,
        backgroundColor: backgroundColour,
        barRadius: const Radius.circular(15),
      ),
      const SizedBox(height: 10),
    ]);
  }
}

class ProgressChart extends StatelessWidget {
  final String title;
  final double progress;
  final Color fillColour;

  const ProgressChart(
      {required this.title,
      required this.progress,
      required this.fillColour,
      super.key});

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Text(
        title,
        textAlign: TextAlign.center,
        style: const TextStyle(
            color: AppColor.dark, fontSize: 16, fontWeight: FontWeight.w700),
      ),
      const SizedBox(height: 10),
      CircularPercentIndicator(
        radius: 45.0,
        lineWidth: 5.0,
        percent: progress,
        backgroundColor: AppColor.percentBackground,
        progressColor: fillColour,
        circularStrokeCap: CircularStrokeCap.round,
        center: Text(
          "${(progress * 100).toInt()}%",
          style: const TextStyle(
              color: AppColor.dark, fontSize: 22, fontWeight: FontWeight.w700),
        ),
      )
    ]);
  }
}