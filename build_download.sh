#!/bin/bash

rm -rf download/*

cd download

mkdir public
mkdir rules
mkdir rule_templates

ln -s ../config/
ln -s ../docker-compose.yml 
ln -s ../nginx_config/

cd public
ln -s ../../public/praeco.config.json 
cd ..

cd rules
ln -s ../../rules/BaseRule.config 
cd ..

zip -r latest.zip *

rm -rf config docker-compose.yml nginx_config praeco.config.json public/ rule_templates/ rules/

