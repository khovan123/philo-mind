import React from "react";
import { View, ActivityIndicator } from "react-native";
import { MovieEngine } from "../movie/MovieEngine";
import { useGetMovieQuery, useSubmitMovieSessionMutation } from "@/services/rtk-api/chapter.api";

type MovieStepProps = {
  muc?: string;
  onDone: () => void;
};

export function MovieStep({ muc, onDone }: MovieStepProps) {
  const {
    data: movie,
    isLoading,
    isError,
  } = useGetMovieQuery(muc || "", {
    skip: !muc,
  });

  const [submitSession] = useSubmitMovieSessionMutation();

  const handleEnd = async (stats: { thienCam: number; uyTin: number; correctN: number }) => {
    if (movie) {
      try {
        await submitSession({
          muc: movie.muc,
          session: stats,
        }).unwrap();
      } catch (err) {
        console.error("Failed to save movie session", err);
      }
    }
    onDone();
  };

  React.useEffect(() => {
    if (!isLoading && isError) {
      onDone();
    }
  }, [isLoading, isError, onDone]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#FF8517" />
      </View>
    );
  }

  if (!movie || isError) {
    return null;
  }

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <MovieEngine script={movie.script} onEnd={handleEnd} />
    </View>
  );
}
