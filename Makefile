LAMBDAS=$(shell for l in $$(ls ./lambda | grep -v util);do echo lambda/$$l;done)
TEMPLATES=$(shell for l in $$(ls ./templates | grep -v util);do echo templates/$$l;done)

build:
	mkdir -p build; mkdir -p build/lambda; mkdir -p build/templates/test;mkdir -p build/templates;mkdir -p build/documents; mkdir -p build/templates/dev

.PHONY: lambda templates upload website

lambda: $(LAMBDAS)
	for l in $^; do \
		cd $$l && make; \
		cd ../..;	\
	done;			

templates: $(TEMPLATES)
	for l in $^; do \
		cd $$l && make; \
		cd ../..;	\
	done;			

upload: templates lambda build
	./bin/upload.sh


