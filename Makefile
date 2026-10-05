.PHONY: dev build preview install clean test test-unit test-build test-controls

dev:
	npm run dev

build:
	npm run build

preview:
	npm run preview

install:
	npm install

clean:
	rm -rf node_modules .astro dist

# Pruebas. Cada fichero de tests/ es independiente y termina con process.exit,
# así que los lanza en procesos aparte y un fallo no deja al resto sin correr.
#
#   test            unitarios + integración, el de siempre
#   test-unit       solo los que no necesitan dist
#   test-build      los que leen dist, y por eso dependen de build
#   test-controls   parchean una copia del bundle y comprueban que los tests
#                   del defecto correspondiente los detectan. Son más lentos
#                   porque spawnean una prueba por control.
test: test-unit test-build

test-unit:
	node tests/run.mjs unit

test-build: build
	node tests/run.mjs build

test-controls: build
	node tests/run.mjs controles
