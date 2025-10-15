import useInitialMediaData from "@/Hooks/useInitialMediaData";
import { renderHook, waitFor } from "@testing-library/react";
import { fetchGeneralData } from "@/helpers/fetchInitialData";

jest.mock("@/helpers/fetchInitialData");

describe("data fetching custom hook test", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should resolve with empty data", async () => {
    (fetchGeneralData as jest.Mock).mockResolvedValueOnce([[]]).mockResolvedValueOnce([[]]).mockResolvedValueOnce([[]]); // tv

    const { result } = renderHook(() => useInitialMediaData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toStrictEqual({ movies: [], moviesHero: [], tv: [] });
    expect(result.current.error).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toStrictEqual({ movies: [], moviesHero: [], tv: [] });
      expect(fetchGeneralData).toHaveBeenCalledTimes(3);
    });
  });

  it("should resolve with data", async () => {
    (fetchGeneralData as jest.Mock)
      .mockResolvedValueOnce([[{ id: 1, title: "Inception" }], 42]) // moviesHero
      .mockResolvedValueOnce([[{ id: 2, title: "Matrix" }], 12]) // movies
      .mockResolvedValueOnce([[{ id: 3, title: "Breaking Bad" }], 5]); // tv

    const { result } = renderHook(() => useInitialMediaData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toStrictEqual({ movies: [], moviesHero: [], tv: [] });
    expect(result.current.error).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.data).toStrictEqual({
        moviesHero: [{ id: 1, title: "Inception" }],
        movies: [{ id: 2, title: "Matrix" }],
        tv: [{ id: 3, title: "Breaking Bad" }],
      });
      expect(fetchGeneralData).toHaveBeenCalledTimes(3);
    });
  });

  it("should handle fetch error", async () => {
    (fetchGeneralData as jest.Mock).mockRejectedValueOnce(new Error("api error"));

    const { result } = renderHook(() => useInitialMediaData());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toStrictEqual({ movies: [], moviesHero: [], tv: [] });
    expect(result.current.error).toBe(false);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe(true);
    });
  });
});
