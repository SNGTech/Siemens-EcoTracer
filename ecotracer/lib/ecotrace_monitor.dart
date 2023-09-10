import 'package:ecotracer/ecotrace_monitor_dashboard.dart';
import 'package:ecotracer/ecotrace_monitor_info.dart';
import "package:flutter/material.dart";
import 'package:ecotracer/constants/colours.dart';

class EcoTracerMonitorPage extends StatefulWidget {
  const EcoTracerMonitorPage({super.key});

  @override
  State<EcoTracerMonitorPage> createState() => _EcoTracerMonitorPageState();
}

class _EcoTracerMonitorPageState extends State<EcoTracerMonitorPage> {
  final topBarHeight = 140.0;
  ValueNotifier<int> pageIndexNotifier = ValueNotifier(0);

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
                  "Monitor",
                  style: TextStyle(
                      fontSize: 29,
                      fontWeight: FontWeight.w500,
                      color: AppColor.dark),
                ),
                SizedBox(height: 3),
                Text(
                  "View Machine Data Here",
                  style: TextStyle(fontSize: 20, color: AppColor.dark),
                )
              ],
            ),
          ),
          Expanded(
              child: Stack(
            children: [
              Positioned.fill(
                  child: ClipRRect(
                      borderRadius: const BorderRadius.only(
                          topLeft: Radius.circular(25),
                          topRight: Radius.circular(25)),
                      child: SingleChildScrollView(
                          child: Container(
                        padding: const EdgeInsets.only(top: 70, bottom: 5),
                        decoration:
                            const BoxDecoration(color: AppColor.background),
                        child: ValueListenableBuilder(
                            valueListenable: pageIndexNotifier,
                            builder: (context, value, child) {
                              return value == 0
                                  ? EcoTracerDashboardWidget()
                                  : EcoTracerMachineInfoWidget();
                            }),
                      )))),
              Positioned(
                  top: 20,
                  left: 15,
                  right: 15,
                  child: TopOptionsBar(pageIndexNotifier: pageIndexNotifier)),
            ],
          ))
        ]));
  }
}

class TopOptionsBar extends StatefulWidget {
  final ValueNotifier<int> pageIndexNotifier;

  const TopOptionsBar({required this.pageIndexNotifier, super.key});

  @override
  State<TopOptionsBar> createState() => _TopOptionsBarState();
}

class _TopOptionsBarState extends State<TopOptionsBar> {
  final topBarHeight = 30.0;

  @override
  Widget build(BuildContext context) {
    return ValueListenableBuilder(
        valueListenable: widget.pageIndexNotifier,
        builder: (context, value, child) {
          return SizedBox(
              height: topBarHeight,
              child: Stack(
                children: [
                  Positioned(
                      left: 0,
                      right: 0,
                      height: topBarHeight,
                      child: Stack(clipBehavior: Clip.none, children: [
                        Positioned(
                            left: -15,
                            right: -15,
                            bottom: -10,
                            top: -20,
                            child: Container(
                                decoration: const BoxDecoration(
                                    color: AppColor.background,
                                    borderRadius: BorderRadius.all(
                                        Radius.circular(25))))),
                        Container(
                            decoration: const BoxDecoration(
                                color: Color(0xFFC3C8BF),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(15)))),
                      ])),
                  // Selector
                  // Listen for navbar to be pressed
                  AnimatedPositioned(
                      duration: const Duration(milliseconds: 300),
                      curve: Curves.decelerate,
                      left: value == 0
                          ? 0
                          : MediaQuery.of(context).size.width / 2 - 15,
                      right: value == 1
                          ? 0
                          : MediaQuery.of(context).size.width / 2 - 15,
                      height: topBarHeight,
                      child: Container(
                        decoration: const BoxDecoration(
                            color: Color(0xFF178772),
                            borderRadius:
                                BorderRadius.all(Radius.circular(15))),
                      )),
                  Align(
                      alignment: Alignment.center,
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.center,
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Expanded(
                              flex: 1,
                              child: GestureDetector(
                                  onTap: () =>
                                      widget.pageIndexNotifier.value = 0,
                                  behavior: HitTestBehavior.opaque,
                                  child: AnimatedDefaultTextStyle(
                                    duration: const Duration(milliseconds: 200),
                                    curve: Curves.decelerate,
                                    style: TextStyle(
                                        color: value == 0
                                            ? AppColor.selected
                                            : AppColor.deselected,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700),
                                    textAlign: TextAlign.center,
                                    child: const Text("Dashboard"),
                                  ))),
                          Expanded(
                              flex: 1,
                              child: GestureDetector(
                                  onTap: () =>
                                      widget.pageIndexNotifier.value = 1,
                                  behavior: HitTestBehavior.opaque,
                                  child: AnimatedDefaultTextStyle(
                                    duration: const Duration(milliseconds: 200),
                                    curve: Curves.decelerate,
                                    style: TextStyle(
                                        color: value == 1
                                            ? AppColor.selected
                                            : AppColor.deselected,
                                        fontSize: 14,
                                        fontWeight: FontWeight.w700),
                                    textAlign: TextAlign.center,
                                    child: const Text("Machine Info"),
                                  )))
                        ],
                      )),
                ],
              ));
        });
  }
}
