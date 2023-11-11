import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";
import { describe, expect, it, beforeAll, afterAll } from "vitest";

describe("Worker", () => {
	let worker: UnstableDevWorker;

	beforeAll(async () => {
		worker = await unstable_dev("src/index.ts", {
			experimental: { disableExperimentalWarning: true },
		});
	});

	afterAll(async () => {
		await worker.stop();
	});

	it("test response format", async () => {
		let url = encodeURIComponent("https://youtu.be/5Na4F98SHLk?si=5qORt6xcccccaTiS&t=5");
		let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
		if (resp) {
			let text = await resp.text();
			expect(text).toBe("https://youtu.be/5Na4F98SHLk?t=5");
		}

		url = encodeURIComponent("https://x.com/virtual_kaf?s=20");
		resp = await worker.fetch(`https://example.com/?url=${url}&preview=true`);
		if (resp) {
			let text = await resp.text();
			expect(text).toBe("https://fxtwitter.com/virtual_kaf");
		}

		url = encodeURIComponent("aHR0cHM6Ly94LmNvbS92aXJ0dWFsX2thZj9zPTIwCg==");
		resp = await worker.fetch(`https://example.com/?url=${url}&preview=false&input=base64`);
		if (resp) {
			let text = await resp.text();
			expect(text).toBe("https://x.com/virtual_kaf");
		}

		url = encodeURIComponent("https://x.com/virtual_kaf?s=20");
		resp = await worker.fetch(`https://example.com/?url=${url}&preview=true&format=json`);
		if (resp) {
			let text = await resp.text();
			expect(text).toBe('{"optimizedUrl":"https://fxtwitter.com/virtual_kaf"}');
		}
	});

	it("Test brute mode", async () => {
		// depth 2 won't be tested sicne it may fail on specfic environment
		let url = encodeURIComponent("https://aka.ms/myrecoverykey")
		let resp = await worker.fetch(`https://example.com/?url=${url}&preview=true&brute=true&depth=1`);
		if (resp) {
			let text = await resp.text();
			expect(text).toBe("https://account.microsoft.com/devices/recoverykey");
		}

		url = encodeURIComponent("https://sparta-en.org/path-to-my-secret-little-files?key=123&track=haha#f")
		resp = await worker.fetch(`https://example.com/?url=${url}&preview=true&brute=true`);
		if (resp) {
			let text = await resp.text();
			expect(text).toBe("https://sparta-en.org/path-to-my-secret-little-files");
		}
	});
});
