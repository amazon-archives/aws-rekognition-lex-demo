BUILD=../../bin/build.js
NAME=$(shell basename $(shell pwd))
DST=../../build/templates/dev

all:$(DST)/*.json

$(DST)/bootstrap.json:./bootstrap.*
	 $(BUILD) $(NAME)/bootstrap

