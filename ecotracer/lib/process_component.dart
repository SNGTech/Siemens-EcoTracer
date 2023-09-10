import 'package:ecotracer/constants/colours.dart';
import 'package:ecotracer/models/processes.dart';
import 'package:flutter/material.dart';

class ProcessComponent extends StatelessWidget {
  final BatchProcess? process;

  const ProcessComponent(this.process, {super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
        padding: const EdgeInsets.symmetric(horizontal: 15),
        margin: const EdgeInsets.only(bottom: 20, left: 25, right: 25),
        constraints: const BoxConstraints.expand(height: 50),
        decoration: BoxDecoration(
            borderRadius: const BorderRadius.all(Radius.circular(20)),
            color: process?.getStatus?.getBgColor),
        child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                  "${process?.getStatus?.getStatusName}: ${process?.getName} 0/${process?.batchNo}",
                  style: const TextStyle(
                      color: AppColor.dark,
                      fontSize: 15,
                      fontWeight: FontWeight.w700)),
              Text(
                () {
                  if (process?.getStatus?.index == ProcessStatus.making.index) {
                    return "${process?.getStatus?.getDescriptor}: 67%";
                  } else {
                    return "${process?.getStatus?.getDescriptor}";
                  }
                }(),
                style: const TextStyle(color: AppColor.dark, fontSize: 15),
              )
            ]));
  }
}
