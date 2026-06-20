import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  testsDb, universesDb, charactersDb, duelsDb,
  likesDb, favoritesDb, recentlyPlayedDb, tierVotesDb, notificationsDb,
  thisOrThatDb, tierListsDb, tierListResultsDb, reportsDb, announcementsDb, guessTasksDb,
  type Test, type Universe, type Character, type Duel, type FavoriteItem,
  type TierVote, type Notification, type ThisOrThat, type TierList, type TierListResult, type Report,
  type Announcement, type GuessTask, type GroupedReport
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

export const useArchivedUniverses = (enabled = true) =>
  useQuery<Universe[]>({
    queryKey: ["archived-universes"],
    queryFn: () => universesDb.getArchived(),
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

export const useArchivedCharacters = (enabled = true) =>
  useQuery<Character[]>({
    queryKey: ["archived-characters"],
    queryFn: () => charactersDb.getArchived(),
    staleTime: 0,
    enabled,
  });

export const useCharactersByIds = (ids: string[]) =>
  useQuery<Character[]>({
    queryKey: ["characters-by-ids", ids],
    queryFn: () => charactersDb.getManyByIds(ids),
    enabled: ids.length > 0,
  });

// ── Duels ─────────────────────────────────────────────────────────────────────

export const useDuels = (lim = 30) =>
  useQuery<Duel[]>({
    queryKey: ["duels", lim],
    queryFn: () => duelsDb.getAll(lim),
    staleTime: 30_000,
  });

export const useDuel = (id: string | undefined) =>
  useQuery<Duel | null>({
    queryKey: ["duel", id],
    queryFn: () => (id ? duelsDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useDuelsByCreator = (creatorId: string | undefined) =>
  useQuery<Duel[]>({
    queryKey: ["duels-by-creator", creatorId],
    queryFn: () => (creatorId ? duelsDb.getByCreator(creatorId) : []),
    enabled: Boolean(creatorId),
  });

// ── Likes ─────────────────────────────────────────────────────────────────────

export const useIsLiked = (userId: string | undefined, testId: string | undefined) =>
  useQuery<boolean>({
    queryKey: ["liked", userId, testId],
    queryFn: () => (userId && testId ? likesDb.isLiked(userId, testId) : false),
    enabled: Boolean(userId && testId),
  });

export const useToggleLike = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, testId }: { userId: string; testId: string }) =>
      likesDb.toggle(userId, testId),
    onSuccess: (_, { userId, testId }) => {
      qc.invalidateQueries({ queryKey: ["liked", userId, testId] });
      qc.invalidateQueries({ queryKey: ["tests"] });
    },
  });
};

// ── Favorites ─────────────────────────────────────────────────────────────────

export const useIsFavorited = (userId: string | undefined, itemId: string | undefined, itemType: FavoriteItem["itemType"]) =>
  useQuery<boolean>({
    queryKey: ["favorited", userId, itemId, itemType],
    queryFn: () => (userId && itemId ? favoritesDb.isFavorited(userId, itemId, itemType) : false),
    enabled: Boolean(userId && itemId),
  });

export const useToggleFavorite = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, itemId, itemType }: { userId: string; itemId: string; itemType: FavoriteItem["itemType"] }) =>
      favoritesDb.toggle(userId, itemId, itemType),
    onSuccess: (_, { userId, itemId, itemType }) => {
      qc.invalidateQueries({ queryKey: ["favorited", userId, itemId, itemType] });
      qc.invalidateQueries({ queryKey: ["user-favorites", userId, itemType] });
    },
  });
};

export const useUserFavorites = (userId: string | undefined, itemType?: FavoriteItem["itemType"]) =>
  useQuery<FavoriteItem[]>({
    queryKey: ["user-favorites", userId, itemType],
    queryFn: () => (userId ? favoritesDb.getUserFavorites(userId, itemType) : []),
    enabled: Boolean(userId),
  });

// ── Tier Votes ────────────────────────────────────────────────────────────────

export const useUserTierVote = (userId: string | undefined, characterId: string | undefined) =>
  useQuery<TierVote | null>({
    queryKey: ["tier-vote", userId, characterId],
    queryFn: () => (userId && characterId ? tierVotesDb.getUserVote(userId, characterId) : null),
    enabled: Boolean(userId && characterId),
  });

export const useUserTierVotes = (userId: string | undefined) =>
  useQuery<TierVote[]>({
    queryKey: ["tier-votes-user", userId],
    queryFn: () => (userId ? tierVotesDb.getUserVotes(userId) : []),
    enabled: Boolean(userId),
  });

// ── Notifications ─────────────────────────────────────────────────────────────

export const useNotifications = (userId: string | undefined) =>
  useQuery<Notification[]>({
    queryKey: ["notifications", userId],
    queryFn: () => (userId ? notificationsDb.getForUser(userId) : []),
    enabled: Boolean(userId),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

// ── Announcements ─────────────────────────────────────────────────────────────

export const useAnnouncements = () =>
  useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: () => announcementsDb.getAll(),
    staleTime: 60_000,
  });

// ── Reports ───────────────────────────────────────────────────────────────────

export const useReports = (enabled = true) =>
  useQuery<Report[]>({
    queryKey: ["admin-reports"],
    queryFn: () => reportsDb.getAll(),
    staleTime: 0,
    enabled,
  });

export const useGroupedReports = (enabled = true) =>
  useQuery<GroupedReport[]>({
    queryKey: ["admin-grouped-reports"],
    queryFn: () => reportsDb.getGrouped(),
    staleTime: 0,
    enabled,
  });

// ── This or That ──────────────────────────────────────────────────────────────

export const useThisOrThats = (lim = 30) =>
  useQuery<ThisOrThat[]>({
    queryKey: ["thisorthats", lim],
    queryFn: () => thisOrThatDb.getAll(lim),
    staleTime: 30_000,
  });

export const useThisOrThat = (id: string | undefined) =>
  useQuery<ThisOrThat | null>({
    queryKey: ["thisorthat", id],
    queryFn: () => (id ? thisOrThatDb.getById(id) : null),
    enabled: Boolean(id),
  });

export const useThisOrThatsByStatus = (status: NonNullable<ThisOrThat["status"]>, enabled = true) =>
  useQuery<ThisOrThat[]>({
    queryKey: ["admin-thisorthats-status", status],
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

export const useTierListResult = (userId: string | undefined, tierListId: string | undefined) =>
  useQuery<TierListResult | null>({
    queryKey: ["tierlist-result", userId, tierListId],
    queryFn: () => (userId && tierListId ? tierListResultsDb.getForUser(userId, tierListId) : null),
    enabled: Boolean(userId && tierListId),
  });

export const useTierListResults = (tierListId: string | undefined) =>
  useQuery<TierListResult[]>({
    queryKey: ["tierlist-results", tierListId],
    queryFn: () => (tierListId ? tierListResultsDb.getForList(tierListId) : []),
    enabled: Boolean(tierListId),
  });

// ── Guess Tasks ───────────────────────────────────────────────────────────────

export const useGuessTasks = () =>
  useQuery<GuessTask[]>({
    queryKey: ["guess-tasks"],
    queryFn: () => guessTasksDb.getAll(),
    staleTime: 60_000,
  });

// ── Admin hooks ───────────────────────────────────────────────────────────────

export const useArchivedTests = (enabled = true) =>
  useQuery<Test[]>({
    queryKey: ["archived-tests"],
    queryFn: () => testsDb.getArchived(),
    staleTime: 0,
    enabled,
  });
