import "package:ecotracer/constants/colours.dart";
import "package:flutter/material.dart";
import 'package:go_router/go_router.dart';

class EcoTracerOptionsPage extends StatelessWidget {
  const EcoTracerOptionsPage({super.key});

  final topBarHeight = 140.0;

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
                  "EcoTrace Options",
                  style: TextStyle(
                      fontSize: 30,
                      fontWeight: FontWeight.w700,
                      color: AppColor.dark),
                ),
                SizedBox(height: 3),
                Text(
                  "Select your Trace Options",
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
                      padding: const EdgeInsets.only(top: 40, bottom: 5),
                      decoration:
                          const BoxDecoration(color: AppColor.background),
                      child: const EcoTracerOptionsWidget())))
        ]));
  }
}

class EcoTracerOptionsWidget extends StatelessWidget {
  const EcoTracerOptionsWidget({super.key});

// TODO: FORMAT THE WIDTHS AND HEIGHTS CORRECTLY for other screen dimensions
  @override
  Widget build(BuildContext context) {
    return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisSize: MainAxisSize.min,
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              SizedBox(
                  child: OptionWidget(
                      "CO2 Tracker",
                      "assets/co2_tracker_thumbnail.png",
                      "/options/co2tracker")),
              SizedBox(width: 15),
              SizedBox(
                  child: OptionWidget("Setup", "assets/set_up_thumbnail.jpg",
                      "/options/setup")),
            ],
          ),
          const SizedBox(height: 15),
          Container(
              padding: const EdgeInsets.symmetric(horizontal: 21),
              child: const OptionWidget(
                  "Monitoring Dashboard",
                  "assets/monitor_dashboard_thumbnail.png",
                  "/options/monitor")),
          const SizedBox(height: 15),
          Container(
              padding: const EdgeInsets.symmetric(horizontal: 21),
              child: const OptionWidget("Carbon Offsetting",
                  "assets/carbon_offsetting_thumbnail.png", "/options/offset"))
        ]);
  }
}

class OptionWidget extends StatelessWidget {
  final String? label;
  final String? imgPath;
  final String? routeName;

  const OptionWidget(this.label, this.imgPath, this.routeName, {super.key});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.go(routeName!),
      child: Stack(fit: StackFit.passthrough, children: [
        ClipRRect(
            borderRadius: const BorderRadius.all(Radius.circular(15)),
            child: Image.asset(imgPath!,
                height: 150,
                fit: BoxFit.fitWidth,
                color: const Color(0x25000000),
                colorBlendMode: BlendMode.srcOver)),
        Positioned(
            bottom: 10,
            left: 10,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
              height: 25,
              decoration: const BoxDecoration(
                  color: AppColor.dark,
                  borderRadius: BorderRadius.all(Radius.circular(15))),
              child: FittedBox(
                  child: Text(
                label!,
                style: const TextStyle(
                    fontSize: 12,
                    color: Color(0xFFDEDEDE),
                    fontWeight: FontWeight.w700),
              )),
            ))
      ]),
    );
  }
}
