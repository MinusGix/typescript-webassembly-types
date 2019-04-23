// Type definitions for WebAssembly
// based off MDN and the WebAssembly spec linked on mdn
// By: MinusGix <https://github.com/MinusGix>

// NOTE: I have to include "dom" in the tsconfig since that is what has fetch's Response object, since nodejs doesn't have it.
declare namespace WebAssembly {
	// TODO: mdn says you can use 'typed array' on the areas which use this, so need to add those
	type BufferData = ArrayBuffer | Int8Array | Uint8Array;

	type ImportExportKind = "function" | "table" | "memory" | "global";

	interface ExportInfo {
		name: string,
		kind: ImportExportKind,
		// Note: spec says other fields (such as signature) may be added in the future
	}

	interface ImportsInfo {
		module: string,
		name: string,
		kind: ImportExportKind,
	}

    class Module {
		constructor (bufferSource: BufferData);

		static customSections(module: Module, sectionName: string): ArrayBuffer[];
		static exports (module: Module): ExportInfo[];
		static imports (module: Module): ImportsInfo[];
	}

    class Instance {
		constructor (module: Module, importObject: object);

		public readonly exports: {
			[index: string]: any;
		};
	}

	interface GlobalDescriptor {
		value: "i32" | "i64" | "f32" | "f64",
		mutable: boolean, // default false
	}
	// I make this generic because I feel it's the best way to go about it
	class Global<T> {
		// TODO: I think this might need to be a number, but idk
		constructor (descriptor: GlobalDescriptor, value: T);

		public value: T;
	}

	interface MemoryDescriptor {
		initial: number,
		maximum?: number,
	}
	class Memory {
		constructor (memoryDescriptor: MemoryDescriptor);

		public buffer: ArrayBuffer;

		grow (pages: number): number;
	}

	interface TableDescriptor {
		element: "anyfunc", // currently can only have this
		initial: number,
		maximum?: number,
	}
	class Table {
		constructor (tableDescriptor: TableDescriptor);

		public readonly length: number;

		get (index: number): Function;
		set (index: number, value: Function): void;
		grow (amount: number): number;
	}

	class CompileError extends Error {}
	class LinkError extends Error {}
	class RuntimeError extends Error {}

    interface ResultObject {
        module: Module;
        instance: Instance;
    }

	function instantiate (bufferSource: BufferData,  importObject?: object): Promise<ResultObject>;
	function instantiateStreaming(source: Response | Promise<Response>, importObject?: object): Promise<ResultObject>;

	function compile (bufferSource: BufferData): Promise<Module>;
	function compileStreaming(source: Response | Promise<Response>): Promise<Module>;

	function validate (bufferSource: BufferData): boolean;
}
