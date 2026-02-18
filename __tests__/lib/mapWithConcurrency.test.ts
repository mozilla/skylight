import { mapWithConcurrency } from "@/lib/mapWithConcurrency";

describe("mapWithConcurrency", () => {
  it("returns results in the same order as the input items", async () => {
    const items = [1, 2, 3, 4, 5];
    // Vary delays so faster items finish before slower ones
    const fn = async (item: number) => {
      await new Promise((r) => setTimeout(r, (6 - item) * 10));
      return item * 10;
    };

    const results = await mapWithConcurrency(items, 2, fn);

    expect(results).toEqual([10, 20, 30, 40, 50]);
  });

  it("never exceeds the concurrency limit", async () => {
    const items = [1, 2, 3, 4, 5, 6];
    const limit = 4;
    let active = 0;
    let maxActive = 0;

    const fn = async (item: number) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
      return item;
    };

    await mapWithConcurrency(items, limit, fn);

    expect(maxActive).toBe(limit);
  });

  it("runs serially when limit is 1", async () => {
    const items = [1, 2, 3, 4];
    let active = 0;
    let maxActive = 0;

    const fn = async (item: number) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 10));
      active--;
      return item;
    };

    await mapWithConcurrency(items, 1, fn);

    expect(maxActive).toBe(1);
  });

  it("runs all items in parallel when limit >= items.length", async () => {
    const items = [1, 2, 3];
    const limit = 5;
    let active = 0;
    let maxActive = 0;

    const fn = async (item: number) => {
      active++;
      maxActive = Math.max(maxActive, active);
      await new Promise((r) => setTimeout(r, 20));
      active--;
      return item;
    };

    await mapWithConcurrency(items, limit, fn);

    expect(maxActive).toBe(3);
  });

  it("rejects with the error if a fn call rejects", async () => {
    const items = [1, 2, 3, 4];
    const fn = async (item: number) => {
      await new Promise((r) => setTimeout(r, 10));
      if (item === 3) {
        throw new Error("boom");
      }
      return item;
    };

    await expect(mapWithConcurrency(items, 2, fn)).rejects.toThrow("boom");
  });

  it("handles an empty array", async () => {
    const results = await mapWithConcurrency([], 3, async (x: number) => x);

    expect(results).toEqual([]);
  });

  describe("limit validation", () => {
    const items = [1, 2, 3];
    const fn = async (x: number) => x;

    it("throws a RangeError when limit is 0", async () => {
      await expect(mapWithConcurrency(items, 0, fn)).rejects.toThrow(
        RangeError,
      );
    });

    it("throws a RangeError when limit is negative", async () => {
      await expect(mapWithConcurrency(items, -1, fn)).rejects.toThrow(
        RangeError,
      );
    });

    it("throws a RangeError when limit is NaN", async () => {
      await expect(mapWithConcurrency(items, NaN, fn)).rejects.toThrow(
        RangeError,
      );
    });
  });
});
