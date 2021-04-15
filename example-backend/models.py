import app

def km(file_name):
    download_helper(file_name)
    a = pds.read_csv("./data/" + file_name, header = 1)
    a = a.select_dtypes(include =np.number)
    a= a.fillna(-1)
    clustering = KMeans(n_clusters = 4, random_state=42).fit(a)
    b = pds.DataFrame(clustering.labels_)
    if(clustering.n_clusters >1):
        modelscore= pds.DataFrame({'silhouette_score':metrics.silhouette_score(a,clustering.labels_),'n_clusters':clustering.n_clusters},index=[0]).to_dict('records')
    else:
        modelscore= pds.DataFrame({'silhouette_score':1 ,'n_clusters':clustering.n_clusters},index=[0]).to_dict('records')

    c =  b.to_dict('records')
    d = clustering.__dict__
    for i in ['init','precompute_distances','n_jobs','cluster_centers_','labels_']:
        d.pop(i)
    e = pds.DataFrame(d,index = [0]).to_dict('records')
    db.db_session.add(db.Model(datasetID=[uuid.UUID(file_name)],modelName="KMeans ",clusteringColumn=c,modelScores=modelscore,modelHyperparameters=e))
    db.db_session.commit()