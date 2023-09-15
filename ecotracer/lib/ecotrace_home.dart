import "package:ecotracer/constants/colours.dart";
import "package:ecotracer/models/processes.dart";
import "package:ecotracer/process_component.dart";
import "package:percent_indicator/percent_indicator.dart";
import "package:flutter/material.dart";
import "package:intl/intl.dart";

// TODO: CONVERT TO MODULAR WIDGET
class EcoTracerHomePage extends StatelessWidget {
  EcoTracerHomePage({super.key});

  final topBarHeight = 140.0;

  final List availableProcesses = [
    BatchProcess("Black Tea", 5, ProcessStatus.inQueue),
    BatchProcess("Green Tea", 35, ProcessStatus.inQueue),
    BatchProcess("Milk Tea", 623, ProcessStatus.inQueue),
    BatchProcess("Passion Fruit Tea", 34, ProcessStatus.paused)
  ];

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
                  "TITUS LIM",
                  style: TextStyle(
                      fontSize: 29,
                      fontWeight: FontWeight.w500,
                      color: AppColor.dark),
                ),
                SizedBox(height: 3),
                Text(
                  "Welcome EcoTracer",
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
                    child: EcoTracerHomeWidget(availableProcesses),
                  ))))
        ]));
  }
}

class EcoTracerHomeWidget extends StatelessWidget {
  final List availableProcesses;

  const EcoTracerHomeWidget(this.availableProcesses, {super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        Container(
            margin: const EdgeInsets.only(bottom: 25, left: 25, right: 25),
            alignment: Alignment.centerLeft,
            child: const Text(
              "Your Carbon Emissions",
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
                      "As of ${DateFormat("yMMMd").format(DateTime.now())}",
                      style: const TextStyle(
                          color: AppColor.offWhite, fontSize: 15),
                    ),
                    Container(
                        margin: const EdgeInsets.only(top: 10),
                        child: const Row(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: [
                            Text(
                              "30.06",
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
                        ))
                  ],
                ))),
        Container(
            padding: const EdgeInsets.symmetric(vertical: 25, horizontal: 25),
            alignment: Alignment.centerLeft,
            child: const Text(
              "Carbon Target",
              style: TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColor.brown,
                  fontSize: 20),
            )),
        // Carbon Target Container
        Container(
            height: 180,
            margin: const EdgeInsets.symmetric(horizontal: 25),
            child: CircularPercentIndicator(
              radius: 90.0,
              lineWidth: 12.0,
              percent: 0.7,
              backgroundColor: AppColor.percentBackground,
              progressColor: AppColor.darkTeal,
              circularStrokeCap: CircularStrokeCap.round,
              center: const Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    "70%",
                    style: TextStyle(
                        color: AppColor.dark,
                        fontSize: 50,
                        fontWeight: FontWeight.w700),
                  ),
                  Text("of Target",
                      style: TextStyle(color: AppColor.dark, fontSize: 20)),
                ],
              ),
            )),
        Container(
            padding:
                const EdgeInsets.only(top: 25, bottom: 20, left: 25, right: 25),
            alignment: Alignment.centerLeft,
            child: Text(
              "Available Processes (${availableProcesses.length})",
              style: const TextStyle(
                  fontWeight: FontWeight.w700,
                  color: AppColor.brown,
                  fontSize: 20),
            )),
        // Available Processes Contrainer
        ListView.builder(
            physics: const NeverScrollableScrollPhysics(),
            padding: const EdgeInsets.all(0),
            shrinkWrap: true,
            itemCount: availableProcesses.length,
            itemBuilder: (context, index) {
              return ProcessComponent(availableProcesses[index]);
            })
      ],
    );
  }
}
