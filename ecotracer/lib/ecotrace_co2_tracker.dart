import "package:ecotracer/charts/co2_consumption/co2_chart.dart";
import "package:ecotracer/constants/colours.dart";
import "package:ecotracer/models/processes.dart";
import "package:ecotracer/process_component.dart";
import "package:percent_indicator/percent_indicator.dart";
import "package:flutter/material.dart";
import "package:intl/intl.dart";

// TODO: CONVERT TO MODULAR WIDGET
class EcoTracerCO2TrackerPage extends StatelessWidget {
  EcoTracerCO2TrackerPage({super.key});

  final topBarHeight = 140.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: AppColor.emerald,
        body: Column(mainAxisSize: MainAxisSize.min, children: [
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
                  "CO2 Tracker",
                  style: TextStyle(
                      fontSize: 29,
                      fontWeight: FontWeight.w500,
                      color: AppColor.dark),
                ),
                SizedBox(height: 3),
                Text(
                  "View CO2 Consumption",
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
                  child: SingleChildScrollView(
                      child: Container(
                    padding: const EdgeInsets.only(top: 20, bottom: 5),
                    decoration: const BoxDecoration(color: AppColor.background),
                    child: EcoTracerCO2Widget(),
                  ))))
        ]));
  }
}

class EcoTracerCO2Widget extends StatefulWidget {
  const EcoTracerCO2Widget({super.key});

  @override
  State<EcoTracerCO2Widget> createState() => _EcoTracerCO2WidgetState();
}

class _EcoTracerCO2WidgetState extends State<EcoTracerCO2Widget> {
  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
            margin: const EdgeInsets.only(bottom: 20, left: 25, right: 25),
            alignment: Alignment.centerLeft,
            child: const Text(
              "Total Carbon Emissions",
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColor.brown,
                  fontSize: 20),
            )),
        // Carbon Emissions Container
        Container(
            height: 120,
            margin: const EdgeInsets.symmetric(horizontal: 25),
            decoration: const BoxDecoration(
                color: AppColor.darkTeal,
                borderRadius: BorderRadius.all(Radius.circular(25))),
            child: Container(
                margin: const EdgeInsets.symmetric(horizontal: 20),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Current Consumption:",
                      style: const TextStyle(
                          color: AppColor.offWhite, fontSize: 15),
                    ),
                    Container(
                        margin: const EdgeInsets.only(top: 5),
                        child: const Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              "29.98",
                              style: TextStyle(
                                  color: AppColor.offWhite,
                                  fontSize: 40,
                                  fontWeight: FontWeight.w700),
                            ),
                            SizedBox(width: 10),
                            Text(
                              "kt",
                              style: TextStyle(
                                  color: AppColor.offWhite,
                                  fontSize: 20,
                                  fontWeight: FontWeight.w700),
                            ),
                          ],
                        )),
                    const Text(
                      "Target: 21.04 kt",
                      style: TextStyle(
                          color: AppColor.offWhite,
                          fontSize: 16,
                          fontWeight: FontWeight.w500),
                    ),
                  ],
                ))),
        GestureDetector(
            // TO IMPLEMENT LISTENER LAMBDA
            onTap: () => debugPrint("User pressed Target button"),
            child: Container(
                margin: const EdgeInsets.only(top: 15, left: 25, right: 25),
                height: 30,
                decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    color: AppColor.btnBg),
                alignment: Alignment.center,
                child: Text(
                  "Change CO2 Target",
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                      color: AppColor.offWhite,
                      fontSize: 15,
                      fontWeight: FontWeight.w700),
                ))),

        Container(
            padding: const EdgeInsets.only(top: 25, bottom: 30, left: 25, right: 25),
            alignment: Alignment.centerLeft,
            child: const Text(
              "Carbon Consumption (kt)",
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColor.brown,
                  fontSize: 20),
            )),
          Container(
            height: 300,
            alignment: Alignment.center,
            margin: const EdgeInsets.only(bottom: 0, left: 5, right: 30),
            child: CO2LineChart()),
          Container(
                  margin: const EdgeInsets.only(left: 10),
                  child: const Text(
                    "Hours",
                    textAlign: TextAlign.center,
                    style: TextStyle(
                        color: AppColor.dark,
                        fontSize: 15,
                        fontWeight: FontWeight.w700),
                  )),
      ],
    );
  }
}
