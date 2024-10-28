import { atom } from "jotai";

import { type Student } from "@prisma/client";

export const studentAtom = atom<Student>();