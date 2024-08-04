"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
    useEffect(() => {
        Crisp.configure("15f4ef2b-bacf-4e70-8374-7ae8458c3d91");
    }, []);

    return null;
}