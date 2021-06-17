import os
import datetime
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import scoped_session
from sqlalchemy import (
    ARRAY,
    create_engine,
    Column,
    Integer,
    String,
    DateTime,
    LargeBinary,
    REAL,
    JSON,
    Boolean,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.mutable import Mutable
from sqlalchemy.sql.sqltypes import INTEGER, JSON, TEXT

SQLALCHEMY_DATABASE_URI = "" #Fill your own database here
engine = create_engine(SQLALCHEMY_DATABASE_URI)
Base = declarative_base(engine)


class MutableList(Mutable, list):
    def append(self, value):
        list.append(self, value)
        self.changed()

    def pop(self, index=0):
        value = list.pop(self, index)
        self.changed()
        return value

    @classmethod
    def coerce(cls, key, value):
        if not isinstance(value, MutableList):
            if isinstance(value, list):
                return MutableList(value)
            return Mutable.coerce(key, value)
        else:
            return value




class Dataset(Base):
    __tablename__ = "DatasetsTable"
    __table_args__ = {"autoload": True, "autoload_with": engine}

    DatasetIDRef = Column(UUID(as_uuid=True), nullable=False, unique=True)
    DatasetName = Column(String)
    Size = Column(Integer, nullable=False)
    Original = Column(Boolean, nullable=False)
    Location = Column(String)
    UploadDate = Column(DateTime, nullable=False)
    Coordinates = Column(ARRAY(JSON))

    def __init__(
        self,
        dataset_uuid,
        dataset_name,
        dataset_size,
        dataset_location,
        coordinates,
        original=True,
    ):
        self.DatasetIDRef = dataset_uuid
        self.DatasetName = dataset_name
        self.Size = dataset_size
        self.Original = original
        self.Location = dataset_location
        self.UploadDate = datetime.datetime.now()
        self.Coordinates = coordinates

class Model(Base):
    __tablename__ = "ModelsTable"
    __table_args__ = {"autoload": True, "autoload_with": engine}

    DatasetID = Column(ARRAY(UUID(as_uuid=True)), nullable=False)
    ModelName = Column(String, nullable=False)
    ClusteringColumn = Column(ARRAY(JSON))
    ModelScores = Column(ARRAY(JSON))
    ModelHyperparameters = Column(ARRAY(JSON))

    def __init__(
        self,
        datasetID,
        modelName,
        clusteringColumn,
        modelScores,
        modelHyperparameters,
    ):
        self.DatasetID = datasetID
        self.ModelName = modelName
        self.ClusteringColumn = clusteringColumn
        self.ModelScores = modelScores
        self.ModelHyperparameters = modelHyperparameters

class Model(Base):
    __tablename__ = "ModelsTable"
    __table_args__ = {"autoload": True, "autoload_with": engine}

    DatasetID = Column(ARRAY(UUID(as_uuid=True)), nullable=False)
    ModelName = Column(String, nullable=False)
    ClusteringColumn = Column(ARRAY(JSON))
    ModelScores = Column(ARRAY(JSON))
    ModelHyperparameters = Column(ARRAY(JSON))

    def __init__(
        self,
        datasetID,
        modelName,
        clusteringColumn,
        modelScores,
        modelHyperparameters,
    ):
        self.DatasetID = datasetID
        self.ModelName = modelName
        self.ClusteringColumn = clusteringColumn
        self.ModelScores = modelScores
        self.ModelHyperparameters = modelHyperparameters

def loadSession():
    metadata = Base.metadata
    Session = scoped_session(sessionmaker(bind=engine))
    session = Session()
    return session


db_session = loadSession()
