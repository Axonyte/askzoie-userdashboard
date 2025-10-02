def RAG_tool(bot_id: str, query: str, top_k: int = 3):
    # model = get_model()
    # q_emb = model.encode([query], convert_to_numpy=True)[0]

    # res = index.query(
    #     vector=q_emb.tolist(),
    #     top_k=top_k,
    #     filter={"bot_id": {"$eq": bot_id}},
    #     include_metadata=True,
    # )

    # results = []
    # for match in res["matches"]:
    #     results.append((match["metadata"]["chunk"], float(match["score"])))
    # return results
    return