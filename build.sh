grpc_tools_node_protoc \
--js_out=import_style=commonjs,binary:./your_dest_dir \
--grpc_out=grpc_js:./your_dest_dir \
--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` \
-I ./src/proto \
./src/proto/*.proto

# generate d.ts codes
protoc \
--plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts \
--ts_out=grpc_js:./your_dest_dir \
-I ./src/proto \
./src/proto/**/*.proto  