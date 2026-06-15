import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  testsDb, universesDb, charactersDb, duelsDb,
  likesDb, favoritesDb, recentlyPlayedDb, tierVotesDb, notificationsDb,
  thisOrThatDb, tierListsDb, tierListResultsDb, reportsDb,
  type Test, type Universe, type Character, type Duel, type FavoriteItem,
  type TierVote, type Notification, type ThisOrThat, type TierList, type TierListResult, type Report
} from "../lib/db";
import type { SeriesCategory } from "../lib/seedData";

// re-export for admin hooks
export type { Universe, Character, ThisOrThat };

// ── Tests ─────────────────────────────────────────────────────────────────────

export const useTests = (filters?: { sort?: "popular" | "new" | "trending"; search?: string }) =>
  useQuery<Test[]>({
    queryKey: ["tests", filters],
    queryFn: () => testsDb.getAll(filters),
    staleTime: 30_000,
  });

export const useTest = (id: string | undefined) =>
  useQuery<Test | null>({
    queryKey: ["test", id],
    queryFn: () => (id ? testsDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useTestsByCreator = (creatorId: string | undefined) =>
  useQuery<Test[]>({
    queryKey: ["tests-by-creator", creatorId],
    queryFn: () => (creatorId ? testsDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

// ── Universes ─────────────────────────────────────────────────────────────────

export const useUniverses = (filters?: { category?: SeriesCategory; search?: string }) =>
  useQuery<Universe[]>({
    queryKey: ["universes", filters],
    queryFn: () => universesDb.getAll(filters),
    staleTime: 60_000,
  });

export const useUniverse = (id: string | undefined) =>
  useQuery<Universe | null>({
    queryKey: ["universe", id],
    queryFn: () => (id ? universesDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useUniversesByCreator = (creatorId: string | undefined) =>
  useQuery<Universe[]>({
    queryKey: ["universes-by-creator", creatorId],
    queryFn: () => (creatorId ? universesDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

export const useUniversesAdmin = (enabled = true) =>
  useQuery<Universe[]>({
    queryKey: ["admin-universes-all"],
    queryFn: () => universesDb.getAllForAdmin(),
    staleTime: 0,
    enabled,
  });

export const useUniversesByStatus = (status: NonNullable<Universe["status"]>, enabled = true) =>
  useQuery<Universe[]>({
    queryKey: ["admin-universes-status", status],
    queryFn: () => universesDb.getByStatus(status),
    staleTime: 0,
    enabled,
  });

// ── Characters ────────────────────────────────────────────────────────────────

export const useCharacters = (filters?: { seriesId?: string; search?: string }) =>
  useQuery<Character[]>({
    queryKey: ["characters", filters],
    queryFn: () => charactersDb.getAll(filters),
    staleTime: 60_000,
  });

export const useCharactersByIds = (ids: string[]) =>
  useQuery<Character[]>({
    queryKey: ["characters-by-ids", ids],
    queryFn: () => (ids.length ? charactersDb.getManyByIds(ids) : []),
    enabled: ids.length > 0,
    staleTime: 120_000,
  });

export const useCharacter = (id: string | undefined) =>
  useQuery<Character | null>({
    queryKey: ["character", id],
    queryFn: () => (id ? charactersDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useCharactersByCreator = (creatorId: string | undefined) =>
  useQuery<Character[]>({
    queryKey: ["characters-by-creator", creatorId],
    queryFn: () => (creatorId ? charactersDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

export const useCharactersAdmin = (enabled = true) =>
  useQuery<Character[]>({
    queryKey: ["admin-characters-all"],
    queryFn: () => charactersDb.getAllForAdmin(),
    staleTime: 0,
    enabled,
  });

export const useCharactersByStatus = (status: NonNullable<Character["status"]>, enabled = true) =>
  useQuery<Character[]>({
    queryKey: ["admin-characters-status", status],
    queryFn: () => charactersDb.getByStatus(status),
    staleTime: 0,
    enabled,
  });

export const useGlobalRanking = () =>
  useQuery<Character[]>({
    queryKey: ["global-ranking"],
    queryFn: () => charactersDb.getAllForRanking(),
    staleTime: 60_000,
  });

// ── Duels ─────────────────────────────────────────────────────────────────────

export const useDuels = (lim = 100) =>
  useQuery<Duel[]>({
    queryKey: ["duels", lim],
    queryFn: () => duelsDb.getAll(lim),
    staleTime: 30_000,
  });

export const useDuelsByCreator = (creatorId: string | undefined) =>
  useQuery<Duel[]>({
    queryKey: ["duels-by-creator", creatorId],
    queryFn: () => (creatorId ? duelsDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

// ── Tier Votes ────────────────────────────────────────────────────────────────

export const useUserTierVote = (userId: string | undefined, characterId: string | undefined) =>
  useQuery<TierVote | null>({
    queryKey: ["tier-vote", userId, characterId],
    queryFn: () => (userId && characterId ? tierVotesDb.getUserVote(userId, characterId) : null),
    enabled: Boolean(userId && characterId),
    staleTime: 60_000,
  });

export const useUserTierVotes = (userId: string | undefined) =>
  useQuery<TierVote[]>({
    queryKey: ["tier-votes", userId],
    queryFn: () => (userId ? tierVotesDb.getUserVotes(userId) : []),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

export const useVoteTier = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, characterId, tier }: { userId: string; characterId: string; tier: TierVote["tier"] }) =>
      tierVotesDb.vote(userId, characterId, tier),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["tier-vote", vars.userId, vars.characterId] });
      qc.invalidateQueries({ queryKey: ["tier-votes", vars.userId] });
      qc.invalidateQueries({ queryKey: ["characters"] });
      qc.invalidateQueries({ queryKey: ["global-ranking"] });
      qc.invalidateQueries({ queryKey: ["character", vars.characterId] });
    },
  });
};

// ── Notifications ─────────────────────────────────────────────────────────────

export const useNotifications = (userId: string | undefined) =>
  useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: () => (userId ? notificationsDb.getForUser(userId) : []),
    enabled: Boolean(userId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

// ── Likes ─────────────────────────────────────────────────────────────────────

export const useIsLiked = (userId: string | undefined, testId: string) =>
  useQuery<boolean>({
    queryKey: ["liked", userId, testId],
    queryFn: () => (userId ? likesDb.isLiked(userId, testId) : false),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

export const useToggleLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, testId }: { userId: string; testId: string }) =>
      likesDb.toggle(userId, testId),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["liked", vars.userId, vars.testId] });
      qc.invalidateQueries({ queryKey: ["test", vars.testId] });
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

// ── Favorites ─────────────────────────────────────────────────────────────────

export const useIsFavorited = (userId: string | undefined, itemId: string, itemType: FavoriteItem["itemType"]) =>
  useQuery<boolean>({
    queryKey: ["favorited", userId, itemId, itemType],
    queryFn: () => (userId ? favoritesDb.isFavorited(userId, itemId, itemType) : false),
    enabled: Boolean(userId),
    staleTime: 60_000,
  });

export const useUserFavorites = (userId: string | undefined, itemType?: FavoriteItem["itemType"]) =>
  useQuery<FavoriteItem[]>({
    queryKey: ["user-favorites", userId, itemType],
    queryFn: () => (userId ? favoritesDb.getUserFavorites(userId, itemType) : []),
    enabled: Boolean(userId),
    staleTime: 30_000,
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, itemId, itemType }: { userId: string; itemId: string; itemType: FavoriteItem["itemType"] }) =>
      favoritesDb.toggle(userId, itemId, itemType),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["favorited", vars.userId, vars.itemId, vars.itemType] });
      qc.invalidateQueries({ queryKey: ["user-favorites", vars.userId] });
      if (vars.itemType === "test") {
        qc.invalidateQueries({ queryKey: ["test", vars.itemId] });
        qc.invalidateQueries({ queryKey: ["tests"] });
      }
    },
  });
};

// ── Recently Played ───────────────────────────────────────────────────────────

export const useRecentlyPlayedTests = (allTests: Test[]) => {
  const recentIds = recentlyPlayedDb.get();
  return recentIds
    .map((id) => allTests.find((t) => t.id === id))
    .filter((t): t is Test => Boolean(t));
};

// ── This or That ──────────────────────────────────────────────────────────────

export const useThisOrThats = (lim = 30) =>
  useQuery<ThisOrThat[]>({
    queryKey: ["this-or-that", lim],
    queryFn: () => thisOrThatDb.getAll(lim),
    staleTime: 30_000,
  });

export const useThisOrThat = (id: string | undefined) =>
  useQuery<ThisOrThat | null>({
    queryKey: ["this-or-that-item", id],
    queryFn: () => (id ? thisOrThatDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useThisOrThatsByCreator = (creatorId: string | undefined) =>
  useQuery<ThisOrThat[]>({
    queryKey: ["this-or-that-by-creator", creatorId],
    queryFn: () => (creatorId ? thisOrThatDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

export const useThisOrThatsAdmin = (enabled = true) =>
  useQuery<ThisOrThat[]>({
    queryKey: ["admin-this-or-that-all"],
    queryFn: () => thisOrThatDb.getAllForAdmin(),
    staleTime: 0,
    enabled,
  });

export const useThisOrThatsByStatus = (status: NonNullable<ThisOrThat["status"]>, enabled = true) =>
  useQuery<ThisOrThat[]>({
    queryKey: ["admin-this-or-that-status", status],
    queryFn: () => thisOrThatDb.getByStatus(status),
    staleTime: 0,
    enabled,
  });

// ── Tier Lists ────────────────────────────────────────────────────────────────

export const useTierLists = (lim = 30) =>
  useQuery<TierList[]>({
    queryKey: ["tierlists", lim],
    queryFn: () => tierListsDb.getAll(lim),
    staleTime: 30_000,
  });

export const useTierList = (id: string | undefined) =>
  useQuery<TierList | null>({
    queryKey: ["tierlist", id],
    queryFn: () => (id ? tierListsDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useTierListsByCreator = (creatorId: string | undefined) =>
  useQuery<TierList[]>({
    queryKey: ["tierlists-by-creator", creatorId],
    queryFn: () => (creatorId ? tierListsDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

export const useUserTierListResult = (tierListId: string | undefined, userId: string | undefined) =>
  useQuery<TierListResult | null>({
    queryKey: ["tierlist-result", tierListId, userId],
    queryFn: () => (tierListId && userId ? tierListResultsDb.getUserResult(tierListId, userId) : null),
    enabled: Boolean(tierListId && userId),
    staleTime: 60_000,
  });

export const useCommunityTierListResults = (tierListId: string | undefined) =>
  useQuery<TierListResult[]>({
    queryKey: ["tierlist-community", tierListId],
    queryFn: () => (tierListId ? tierListResultsDb.getCommunityResults(tierListId) : []),
    enabled: Boolean(tierListId),
    staleTime: 30_000,
  });

// ── Moderation / Reports ──────────────────────────────────────────────────────

export const usePendingTests = () =>
  useQuery<Test[]>({
    queryKey: ["admin-pending-tests"],
    queryFn: () => testsDb.getPending(),
    staleTime: 0,
  });

export const useOpenReports = () =>
  useQuery<Report[]>({
    queryKey: ["admin-open-reports"],
    queryFn: () => reportsDb.getOpen(),
    staleTime: 0,
  });
