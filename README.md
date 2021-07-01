# XIUtilsEquipCalculator
[![Pages Build](https://travis-ci.com/semuer/XIUtilsEquipCalculator.svg?branch=main)](https://travis-ci.com/semuer/XIUtilsEquipCalculator)
![GitHub](https://img.shields.io/github/license/semuer/XIUtilsEquipCalculator)
![Contributions welcome](https://img.shields.io/badge/contributions-welcome-orange.svg)
![GitHub issues](https://img.shields.io/github/issues/semuer/XIUtilsEquipCalculator)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/semuer/XIUtilsEquipCalculator)

An Equipment Parameters Calculator for FINAL FANTASY XI.

* DevEnv: NodeJs / VueJs
* JP/EN support is planned (Currently in active development for JP UI)
* Issue / PR are welcomed
* Github Pages: https://semuer.github.io/XIUtilsEquipCalculator/ (main branch)


MMORPG「ファイナルファンタジーXI」用装備セットシミュレーターサイトのソースプロジェクト

* 開発環境：NodeJs / VueJs
* 日本語・英語両方対応予定(現状日本語を優先して機能開発をしている)
* Issue / PR 歓迎
* サイトURL: https://semuer.github.io/XIUtilsEquipCalculator/ (CIによりmainブランチ即時反映)

----

Currently under heavy development. Source code is ugly for now.
I'm not a professional web developer, please understand :)

### About Item Properties Parsing

There's no simple way to parse item(equipment)'s properties to semantic or structure data with English version to my knowledge.
But the Japanese version of the game dat texts is far more structured, so this project will parse
items properties with JP dats and semi-automatically (or nearly manually) make a dictionary that translate JP properties to EN.
We could also keep the functional consistency on both JP and EN sides easier by this way.

----

### About Database Storage

Currently, the site is using im-memory database (LokiJs). All the data query processings are running on the client side.
Data sources are multiple json files, which have about ~30MBytes in total without g-zip compression.
If data becomes more complicated in the future, the site may use a remote database service.

----

FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.
FINAL FANTASY XI © 2002 - 2020 SQUARE ENIX CO., LTD. All Rights Reserved.
