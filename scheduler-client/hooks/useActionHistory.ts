"use client";

import { useState, useEffect, useCallback } from "react";
import { historyApi } from "@/lib/api";
import type { ActionHistoryResponseDto } from "@/types";
import { getErrorMessage } from "@/lib/utils";

// Fetch whole history
export function useActionHistory() {
    const [history, setHistory] = useState<ActionHistoryResponseDto[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);
    const [historyError, setHistoryError] = useState("");

    const fetch = useCallback(async () => {
        setHistoryLoading(true);
        setHistoryError("");
        try {
            const { data } = await historyApi.getAll();
            setHistory(data);
        } catch(err) {
            setHistoryError(getErrorMessage(err));
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => { fetch(); }, [fetch]);

    return { history, historyLoading, historyError, refetch: fetch };
}